package com.example.findX.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "found_items")
public class FoundItem {
    @Id
    private String id;
    private String rollNo;
    private String name;
    private String item;
    private String location;
    private String date;
    private String description;
    private String imageUrl;
    private String reportedBy;
    private LocalDateTime createdAt;
    private boolean claimed;
    
    // New fields for contact information and matching
    private String postedBy; // User ID who posted this item
    private String contactEmail;
    private String contactPhone;
    private String status; // OPEN, POSSIBLE_MATCH, CLOSED
    private String matchedWith; // ID of matched lost item
    private boolean notified; // to track if match email sent
    // Claim workflow
    private String pendingClaimUserId; // user id/email who claimed
    private String claimDescription;
    private String claimIdProof;
}
