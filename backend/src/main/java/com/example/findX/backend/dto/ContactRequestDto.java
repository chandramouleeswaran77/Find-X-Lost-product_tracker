package com.example.findX.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactRequestDto {
    private String itemName;
    private String itemId;
    private String requesterName;
    private String requesterEmail;
    private String message;
}
