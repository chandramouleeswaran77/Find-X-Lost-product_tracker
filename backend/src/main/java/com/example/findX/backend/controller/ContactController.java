package com.example.findX.backend.controller;

import com.example.findX.backend.model.ContactRequest;
import com.example.findX.backend.service.ContactRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:5173")
public class ContactController {
    
    @Autowired
    private ContactRequestService contactRequestService;
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createContactRequest(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            ContactRequest contactRequest = new ContactRequest();
            contactRequest.setItemName(request.get("itemName"));
            contactRequest.setItemId(request.get("itemId"));
            contactRequest.setRequesterName(request.get("requesterName"));
            contactRequest.setRequesterEmail(request.get("requesterEmail"));
            contactRequest.setMessage(request.get("message"));
            
            ContactRequest savedRequest = contactRequestService.createContactRequest(contactRequest);
            
            response.put("success", true);
            response.put("message", "Contact request sent successfully");
            response.put("data", savedRequest);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to send contact request");
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping
    public ResponseEntity<List<ContactRequest>> getAllContactRequests() {
        List<ContactRequest> contactRequests = contactRequestService.getAllContactRequests();
        return ResponseEntity.ok(contactRequests);
    }
    
    @GetMapping("/item/{itemName}")
    public ResponseEntity<List<ContactRequest>> getContactRequestsByItemName(@PathVariable String itemName) {
        List<ContactRequest> contactRequests = contactRequestService.getContactRequestsByItemName(itemName);
        return ResponseEntity.ok(contactRequests);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ContactRequest> getContactRequestById(@PathVariable String id) {
        return contactRequestService.getContactRequestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ContactRequest> updateContactRequest(@PathVariable String id, @RequestBody ContactRequest contactRequest) {
        if (contactRequestService.getContactRequestById(id).isPresent()) {
            contactRequest.setId(id);
            ContactRequest updatedRequest = contactRequestService.updateContactRequest(contactRequest);
            return ResponseEntity.ok(updatedRequest);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContactRequest(@PathVariable String id) {
        if (contactRequestService.getContactRequestById(id).isPresent()) {
            contactRequestService.deleteContactRequest(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
