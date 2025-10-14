package com.example.findX.backend.service;

import com.example.findX.backend.model.Notification;
import com.example.findX.backend.model.User;
import com.example.findX.backend.repository.NotificationRepository;
import com.example.findX.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    /**
     * Resolve a user by multiple possible identifiers: Mongo _id, email, or username
     */
    private Optional<User> resolveUser(String idOrEmailOrUsername) {
        if (idOrEmailOrUsername == null || idOrEmailOrUsername.isBlank()) {
            return Optional.empty();
        }
        // Try by Mongo _id
        try {
            Optional<User> byId = userRepository.findById(idOrEmailOrUsername);
            if (byId.isPresent()) return byId;
        } catch (Exception ignored) {}
        // Try by email
        try {
            Optional<User> byEmail = userRepository.findByEmail(idOrEmailOrUsername);
            if (byEmail.isPresent()) return byEmail;
        } catch (Exception ignored) {}
        // Try by username
        try {
            Optional<User> byUsername = userRepository.findByUsername(idOrEmailOrUsername);
            if (byUsername.isPresent()) return byUsername;
        } catch (Exception ignored) {}
        return Optional.empty();
    }

    public Notification createNotification(String userId, String message, String itemId, String itemType, String type) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setMessage(message);
        notification.setItemId(itemId);
        notification.setItemType(itemType);
        notification.setType(type);
        notification.setRead(false);
        try {
            // Set createdAt if the model supports it
            java.lang.reflect.Method setter = notification.getClass().getMethod("setCreatedAt", java.time.LocalDateTime.class);
            setter.invoke(notification, java.time.LocalDateTime.now());
        } catch (Exception ignored) {}
        return notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    public Notification markAsRead(String notificationId) {
        Optional<Notification> notification = notificationRepository.findById(notificationId);
        if (notification.isPresent()) {
            notification.get().setRead(true);
            return notificationRepository.save(notification.get());
        }
        return null;
    }

    public void notifyMatch(String lostUserId, String foundUserId, String lostItemId, String foundItemId, String itemTitle) {
        // Create notifications for both users
        createNotification(lostUserId, 
            "We found a possible match for your lost item '" + itemTitle + "'. Please check your dashboard for details.",
            lostItemId, "LOST", "MATCH");
        
        createNotification(foundUserId, 
            "Your found item '" + itemTitle + "' might belong to someone. Please check your dashboard for details.",
            foundItemId, "FOUND", "MATCH");

        // Send email notifications if mail sender is available
        sendMatchEmail(lostUserId, foundUserId, itemTitle);
    }

    public void sendMatchEmail(String lostUserId, String foundUserId, String itemTitle) {
        if (mailSender == null) {
            System.out.println("Email service not configured. Skipping email notification for item: " + itemTitle);
            return;
        }

        try {
            Optional<User> lostUser = resolveUser(lostUserId);
            Optional<User> foundUser = resolveUser(foundUserId);

            if (lostUser.isPresent() && foundUser.isPresent()) {
                // Email to lost item owner
                SimpleMailMessage lostUserEmail = new SimpleMailMessage();
                lostUserEmail.setTo(lostUser.get().getEmail());
                lostUserEmail.setSubject("FindX: Possible Match Found for Your Lost Item");
                lostUserEmail.setText("Hi " + lostUser.get().getName() + ",\n\n" +
                    "We found a possible match for your lost item '" + itemTitle + "'.\n" +
                    "Please check your FindX dashboard for details and contact information.\n\n" +
                    "Best regards,\nFindX Team");
                mailSender.send(lostUserEmail);

                // Email to found item owner
                SimpleMailMessage foundUserEmail = new SimpleMailMessage();
                foundUserEmail.setTo(foundUser.get().getEmail());
                foundUserEmail.setSubject("FindX: Your Found Item Might Have an Owner");
                foundUserEmail.setText("Hi " + foundUser.get().getName() + ",\n\n" +
                    "Your found item '" + itemTitle + "' might belong to someone.\n" +
                    "Please check your FindX dashboard for details and contact information.\n\n" +
                    "Best regards,\nFindX Team");
                mailSender.send(foundUserEmail);
            }
        } catch (Exception e) {
            System.err.println("Failed to send email notification: " + e.getMessage());
        }
    }

    public void sendClaimNotification(String userId, String itemId, String itemTitle) {
        createNotification(userId, 
            "Your claim request for item '" + itemTitle + "' has been submitted for verification.",
            itemId, "FOUND", "CLAIM");

        // Also notify admin
        notifyAdmin("New claim submitted for '" + itemTitle + "'. Please review and approve.");
    }

    public void sendClaimApproval(String userId, String itemId, String itemTitle) {
        createNotification(userId, 
            "Your claim for item '" + itemTitle + "' has been approved! Please contact the admin to collect your item.",
            itemId, "FOUND", "CLAIM");
    }

    public void sendClaimDecisionEmail(String userIdOrEmailOrUsername, boolean approved, String itemTitle) {
        if (mailSender == null) {
            return;
        }
        try {
            Optional<User> userOpt = resolveUser(userIdOrEmailOrUsername);
            if (userOpt.isEmpty()) return;
            User user = userOpt.get();
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(user.getEmail());
            mail.setSubject(approved ? "FindX: Your Claim Was Approved" : "FindX: Your Claim Was Declined");
            mail.setText(
                ("Hi " + (user.getName() != null ? user.getName() : user.getUsername()) + ",\n\n") +
                (approved
                    ? ("Good news! Your claim for the item '" + itemTitle + "' has been approved.\n" +
                       "Visit your dashboard: http://localhost:5173/found to see the update and collection details.\n\n")
                    : ("We’re sorry, but your claim for the item '" + itemTitle + "' was declined.\n" +
                       "You can review the item details here: http://localhost:5173/found and try again if needed.\n\n")) +
                "Best regards,\nFindX Team"
            );
            mailSender.send(mail);
        } catch (Exception ignored) {}
    }

    public void notifyAdmin(String message) {
        // Create an in-app admin notification only (avoid sending emails to admin for every event)
        try {
            createNotification("ADMIN_INBOX", message, null, "ADMIN", "ADMIN");
        } catch (Exception ignored) {}
    }
}
