package com.example.findX.backend.service;

import com.example.findX.backend.model.ContactRequest;
import com.example.findX.backend.repository.ContactRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ContactRequestService {
    
    @Autowired
    private ContactRequestRepository contactRequestRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    public ContactRequest createContactRequest(ContactRequest contactRequest) {
        contactRequest.setCreatedAt(LocalDateTime.now());
        contactRequest.setProcessed(false);
        
        // Save the contact request
        ContactRequest saved = contactRequestRepository.save(contactRequest);
        
        // Create notification for item owner
        if (contactRequest.getItemOwnerId() != null) {
            String message = String.format(
                "%s sent you a message about your %s item '%s': %s",
                contactRequest.getRequesterName(),
                contactRequest.getItemType(),
                contactRequest.getItemName(),
                contactRequest.getMessage()
            );
            
            notificationService.createNotification(
                contactRequest.getItemOwnerId(),
                message,
                contactRequest.getItemId(),
                contactRequest.getItemType().toUpperCase(),
                "MESSAGE"
            );
        }
        
        return saved;
    }
    
    public List<ContactRequest> getAllContactRequests() {
        return contactRequestRepository.findByProcessedFalse();
    }
    
    public List<ContactRequest> getContactRequestsByItemName(String itemName) {
        return contactRequestRepository.findByItemName(itemName);
    }
    
    public Optional<ContactRequest> getContactRequestById(String id) {
        return contactRequestRepository.findById(id);
    }
    
    public ContactRequest updateContactRequest(ContactRequest contactRequest) {
        return contactRequestRepository.save(contactRequest);
    }
    
    public void deleteContactRequest(String id) {
        contactRequestRepository.deleteById(id);
    }
}
