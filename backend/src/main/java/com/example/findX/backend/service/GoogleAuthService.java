package com.example.findX.backend.service;

import com.example.findX.backend.model.User;
import com.example.findX.backend.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.Optional;

@Service
public class GoogleAuthService {

    private final GoogleIdTokenVerifier verifier;
    private final UserRepository userRepository;
    private final String clientId;

    public GoogleAuthService(@Value("${google.oauth.client-id}") String clientId,
                             UserRepository userRepository) throws Exception {
        this.userRepository = userRepository;
        this.clientId = clientId;
        this.verifier = new GoogleIdTokenVerifier.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(clientId))
                .setIssuers(java.util.Arrays.asList("accounts.google.com", "https://accounts.google.com"))
                .build();
    }

    public Optional<User> verifyTokenAndGetOrCreateUser(String idTokenString) throws GeneralSecurityException, java.io.IOException {
        GoogleIdToken idToken = null;
        try {
            idToken = verifier.verify(idTokenString);
        } catch (Exception e) {
            // Fall through to tokeninfo fallback
        }

        Payload payload;
        if (idToken != null) {
            payload = idToken.getPayload();
            // Audience check (defense-in-depth)
            Object aud = payload.getAudience();
            if (aud == null || !clientId.equals(aud.toString())) {
                throw new IllegalArgumentException("Invalid audience for ID token");
            }
        } else {
            // Fallback: use tokeninfo endpoint to diagnose/verify
            payload = verifyViaTokenInfo(idTokenString).orElse(null);
            if (payload == null) {
                throw new IllegalArgumentException("Invalid Google token (tokeninfo) or network error");
            }
            // tokeninfo returns aud; verify it matches expected clientId
            Object aud = payload.getAudience();
            if (aud == null || !clientId.equals(aud.toString())) {
                throw new IllegalArgumentException("Invalid audience from tokeninfo");
            }
        }
        String userId = payload.getSubject();
        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String picture = (String) payload.get("picture");

        // Prefer existing user by email
        Optional<User> existingByEmail = userRepository.findByEmail(email);
        if (existingByEmail.isPresent()) {
            return existingByEmail;
        }

        // Or by username (subject)
        Optional<User> existingByUsername = userRepository.findByUsername(userId);
        if (existingByUsername.isPresent()) {
            return existingByUsername;
        }

        // Create new user
        User newUser = new User();
        newUser.setUsername(userId);
        newUser.setName(name != null ? name : email);
        newUser.setEmail(email);
        newUser.setPassword(null); // no password for Google SSO
        newUser.setRollNo(null);
        // Assign role by email
        String role = "STUDENT";
        if ("findxadmin@bitsathy.ac.in".equalsIgnoreCase(email)) {
            role = "ADMIN";
        } else if (email != null && email.endsWith("@bitsathy.ac.in") && !email.toLowerCase().contains(".cs")) {
            role = "STAFF";
        }
        newUser.setRole(role);
        newUser.setPictureUrl(picture);
        return Optional.of(userRepository.save(newUser));
    }

    private Optional<Payload> verifyViaTokenInfo(String idTokenString) {
        try {
            java.net.URL url = new java.net.URL("https://oauth2.googleapis.com/tokeninfo?id_token=" + java.net.URLEncoder.encode(idTokenString, java.nio.charset.StandardCharsets.UTF_8));
            java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);
            int code = conn.getResponseCode();
            if (code != 200) {
                return Optional.empty();
            }
            try (java.io.InputStream in = conn.getInputStream(); java.io.InputStreamReader r = new java.io.InputStreamReader(in)) {
                com.google.gson.JsonObject json = com.google.gson.JsonParser.parseReader(r).getAsJsonObject();
                String aud = json.has("aud") ? json.get("aud").getAsString() : null;
                if (aud == null) return Optional.empty();
                // audience check handled by verifier normally; tokeninfo ensures signature validity on Google side
                Payload p = new Payload();
                if (json.has("sub")) p.setSubject(json.get("sub").getAsString());
                if (json.has("email")) p.setEmail(json.get("email").getAsString());
                if (json.has("name")) p.set("name", json.get("name").getAsString());
                if (json.has("picture")) p.set("picture", json.get("picture").getAsString());
                return Optional.of(p);
            }
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}


