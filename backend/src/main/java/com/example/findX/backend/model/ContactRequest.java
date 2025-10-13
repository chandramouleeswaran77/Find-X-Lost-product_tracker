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
@Document(collection = "contact_requests")
public class ContactRequest {
    @Id
    private String id;
    private String itemName;
    private String itemId;
    private String requesterName;
    private String requesterEmail;
    private String message;
    private LocalDateTime createdAt;
    private boolean processed;
}
