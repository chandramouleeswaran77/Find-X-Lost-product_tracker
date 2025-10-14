package com.example.findX.backend.controller;

import com.example.findX.backend.model.FoundItem;
import com.example.findX.backend.model.LostItem;
import com.example.findX.backend.model.User;
import com.example.findX.backend.repository.FoundItemRepository;
import com.example.findX.backend.repository.LostItemRepository;
import com.example.findX.backend.repository.UserRepository;
import com.example.findX.backend.service.LostItemService;
import com.example.findX.backend.service.FoundItemService;
import com.example.findX.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/admin-tools")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired private UserRepository userRepository;
    @Autowired private LostItemRepository lostItemRepository;
    @Autowired private FoundItemRepository foundItemRepository;
    @Autowired private LostItemService lostItemService;
    @Autowired private FoundItemService foundItemService;
    @Autowired private NotificationService notificationService;

    @PostMapping("/seed-sample")
    public ResponseEntity<Map<String, Object>> seedSample() {
        // Create two users if not exists
        User a = userRepository.findByEmail("lost.user@example.com").orElseGet(() -> {
            User u = new User();
            u.setEmail("lost.user@example.com");
            u.setUsername("lost.user@example.com");
            u.setName("Lost User");
            u.setRole("STUDENT");
            return userRepository.save(u);
        });
        User b = userRepository.findByEmail("found.user@example.com").orElseGet(() -> {
            User u = new User();
            u.setEmail("found.user@example.com");
            u.setUsername("found.user@example.com");
            u.setName("Found User");
            u.setRole("STUDENT");
            return userRepository.save(u);
        });

        // Create lost
        LostItem lost = new LostItem();
        lost.setItem("AirPods Pro Black");
        lost.setDescription("Lost my black AirPods near library");
        lost.setLocation("Library");
        lost.setDate(java.time.LocalDate.now().toString());
        lost.setReportedBy(a.getEmail());
        lost.setPostedBy(a.getEmail());
        lost.setContactEmail(a.getEmail());
        lost.setStatus("OPEN");
        lost.setCreatedAt(LocalDateTime.now());
        lost = lostItemRepository.save(lost);

        // Create found
        FoundItem found = new FoundItem();
        found.setItem("AirPods Black");
        found.setDescription("Found black AirPods outside library");
        found.setLocation("Library");
        found.setDate(java.time.LocalDate.now().toString());
        found.setReportedBy(b.getEmail());
        found.setPostedBy(b.getEmail());
        found.setContactEmail(b.getEmail());
        found.setStatus("OPEN");
        found.setCreatedAt(LocalDateTime.now());
        found = foundItemRepository.save(found);

        // Trigger matching (services already do notifyMatch when save/update)
        try {
            // Call service-side matching by re-saving via services if needed
            lostItemService.updateLostItem(lost);
            foundItemService.updateFoundItem(found);
        } catch (Exception ignored) {}

        // Fallback: explicitly notify both
        notificationService.notifyMatch(a.getEmail(), b.getEmail(), lost.getId(), found.getId(), lost.getItem());

        return ResponseEntity.ok(Map.of(
            "ok", true,
            "lostItemId", lost.getId(),
            "foundItemId", found.getId(),
            "lostUser", a.getEmail(),
            "foundUser", b.getEmail()
        ));
    }
}

