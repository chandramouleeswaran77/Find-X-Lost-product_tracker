package com.example.findX.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    private String userId;
    private String message;
    private String itemId;
    private String itemType; // "LOST" or "FOUND"
    private Date createdAt = new Date();
    private boolean read = false;
    private String type; // "MATCH", "CLAIM", "GENERAL"
}
