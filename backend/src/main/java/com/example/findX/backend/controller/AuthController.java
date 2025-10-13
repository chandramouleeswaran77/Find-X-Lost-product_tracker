package com.example.findX.backend.controller;

import com.example.findX.backend.model.User;
import com.example.findX.backend.service.UserService;
import com.example.findX.backend.service.GoogleAuthService;
import com.example.findX.backend.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    
    @Autowired
    private UserService userService;
    @Autowired
    private GoogleAuthService googleAuthService;
    @Autowired
    private JwtService jwtService;
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        
        Map<String, Object> response = new HashMap<>();
        
        if (userService.authenticateUser(username, password)) {
            Optional<User> user = userService.getUserByUsername(username);
            if (user.isPresent()) {
                String token = jwtService.generateToken(user.get().getUsername(), Map.of(
                        "role", user.get().getRole(),
                        "name", user.get().getName()
                ));
                response.put("success", true);
                response.put("user", user.get());
                response.put("token", token);
                response.put("message", "Login successful");
                return ResponseEntity.ok(response);
            }
        }
        
        response.put("success", false);
        response.put("message", "Invalid credentials");
        return ResponseEntity.badRequest().body(response);
    }
    
    @PostMapping("/google")
    public ResponseEntity<Map<String, Object>> googleLogin(@RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();
        String token = body.get("token");
        if (token == null || token.isBlank()) {
            response.put("success", false);
            response.put("message", "Missing token");
            return ResponseEntity.badRequest().body(response);
        }
        try {
            return googleAuthService.verifyTokenAndGetOrCreateUser(token)
                    .map(user -> {
                        Map<String, Object> ok = new HashMap<>();
                        String jwt = jwtService.generateToken(user.getUsername(), Map.of(
                                "role", user.getRole(),
                                "name", user.getName()
                        ));
                        ok.put("success", true);
                        ok.put("user", user);
                        ok.put("token", jwt);
                        ok.put("message", "Google login successful");
                        return ResponseEntity.ok(ok);
                    })
                    .orElseGet(() -> {
                        Map<String, Object> bad = new HashMap<>();
                        bad.put("success", false);
                        bad.put("message", "Invalid Google token");
                        return ResponseEntity.badRequest().body(bad);
                    });
        } catch (Exception e) {
            Map<String, Object> bad = new HashMap<>();
            bad.put("success", false);
            bad.put("message", "Google verification failed");
            bad.put("error", e.getMessage());
            return ResponseEntity.status(401).body(bad);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        
        // Check if user already exists
        if (userService.getUserByUsername(user.getUsername()).isPresent()) {
            response.put("success", false);
            response.put("message", "Username already exists");
            return ResponseEntity.badRequest().body(response);
        }
        
        if (userService.getUserByEmail(user.getEmail()).isPresent()) {
            response.put("success", false);
            response.put("message", "Email already exists");
            return ResponseEntity.badRequest().body(response);
        }
        
        User savedUser = userService.createUser(user);
        response.put("success", true);
        response.put("user", savedUser);
        response.put("message", "Registration successful");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/user/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userService.getUserByUsername(username);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
