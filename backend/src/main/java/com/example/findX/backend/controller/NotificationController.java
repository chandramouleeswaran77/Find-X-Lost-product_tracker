package com.example.findX.backend.controller;

import com.example.findX.backend.model.Notification;
import com.example.findX.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable String userId) {
        List<Notification> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@PathVariable String userId) {
        List<Notification> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/{userId}/count")
    public ResponseEntity<Long> getUnreadCount(@PathVariable String userId) {
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(count);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable String id) {
        Notification notification = notificationService.markAsRead(id);
        if (notification != null) {
            return ResponseEntity.ok(notification);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        Notification created = notificationService.createNotification(
            notification.getUserId(),
            notification.getMessage(),
            notification.getItemId(),
            notification.getItemType(),
            notification.getType()
        );
        return ResponseEntity.ok(created);
    }

    // Simple test endpoint to verify notifications and email delivery
    @PostMapping("/test-match")
    public ResponseEntity<Map<String, Object>> testMatch(@RequestBody Map<String, String> payload) {
        // Accept identifiers as userId/email/username
        String lostUser = payload.getOrDefault("lostUser", "");
        String foundUser = payload.getOrDefault("foundUser", "");
        String itemTitle = payload.getOrDefault("itemTitle", "Sample Item");
        String lostItemId = payload.getOrDefault("lostItemId", "lost-test-id");
        String foundItemId = payload.getOrDefault("foundItemId", "found-test-id");

        notificationService.notifyMatch(lostUser, foundUser, lostItemId, foundItemId, itemTitle);
        return ResponseEntity.ok(Map.of(
            "ok", true,
            "message", "Test match notification dispatched",
            "lostUser", lostUser,
            "foundUser", foundUser,
            "itemTitle", itemTitle
        ));
    }
}
