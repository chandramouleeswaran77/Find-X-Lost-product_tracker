package com.example.findX.backend.controller;

import com.example.findX.backend.model.FoundItem;
import com.example.findX.backend.dto.ClaimRequest;
import com.example.findX.backend.service.FoundItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/found")
@CrossOrigin(origins = "http://localhost:5173")
public class FoundItemController {
    
    @Autowired
    private FoundItemService foundItemService;
    
    private static final String UPLOAD_DIR = "uploads/found/";
    
    @GetMapping
    public ResponseEntity<List<FoundItem>> getAllFoundItems() {
        List<FoundItem> foundItems = foundItemService.getAllFoundItems();
        return ResponseEntity.ok(foundItems);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<FoundItem>> searchFoundItems(@RequestParam String q) {
        List<FoundItem> foundItems = foundItemService.searchFoundItems(q);
        return ResponseEntity.ok(foundItems);
    }
    
    @PostMapping
    public ResponseEntity<FoundItem> createFoundItem(
            @RequestParam String rollNo,
            @RequestParam String name,
            @RequestParam String item,
            @RequestParam String location,
            @RequestParam String date,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile photo,
            @RequestParam String user,
            @RequestParam(required = false) String contactEmail,
            @RequestParam(required = false) String contactPhone) {
        
        try {
            FoundItem foundItem = new FoundItem();
            foundItem.setRollNo(rollNo);
            foundItem.setName(name);
            foundItem.setItem(item);
            foundItem.setLocation(location);
            foundItem.setDate(date);
            foundItem.setDescription(description);
            // Prefer stable identifier for notifications: contactEmail -> user -> rollNo
            String ownerIdentifier = contactEmail != null && !contactEmail.isBlank() ? contactEmail : (user != null && !user.isBlank() ? user : rollNo);
            foundItem.setReportedBy(ownerIdentifier);
            foundItem.setPostedBy(ownerIdentifier);
            foundItem.setContactEmail(contactEmail);
            foundItem.setContactPhone(contactPhone);
            foundItem.setStatus("OPEN");
            
            // Handle file upload
            if (photo != null && !photo.isEmpty()) {
                String fileName = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(photo.getInputStream(), filePath);
                // Set full URL for image access
                foundItem.setImageUrl("http://localhost:8080/uploads/found/" + fileName);
            } else {
                foundItem.setImageUrl(null);
            }
            
            FoundItem savedItem = foundItemService.createFoundItem(foundItem);
            return ResponseEntity.ok(savedItem);
            
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<FoundItem> getFoundItemById(@PathVariable String id) {
        return foundItemService.getFoundItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<FoundItem> updateFoundItem(@PathVariable String id, @RequestBody FoundItem foundItem) {
        if (foundItemService.getFoundItemById(id).isPresent()) {
            foundItem.setId(id);
            FoundItem updatedItem = foundItemService.updateFoundItem(foundItem);
            return ResponseEntity.ok(updatedItem);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFoundItem(@PathVariable String id) {
        if (foundItemService.getFoundItemById(id).isPresent()) {
            foundItemService.deleteFoundItem(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/{id}/claim")
    public ResponseEntity<?> claimItem(@PathVariable String id, @RequestBody ClaimRequest claimRequest) {
        try {
            FoundItem claimedItem = foundItemService.verifyClaim(
                id, 
                claimRequest.getUserId(), 
                claimRequest.getIdProof(), 
                claimRequest.getDescription()
            );
            
            if (claimedItem != null) {
                return ResponseEntity.ok("Claim submitted for verification");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to process claim: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}/resolve")
    public ResponseEntity<FoundItem> resolveFoundItem(@PathVariable String id) {
        Optional<FoundItem> itemOpt = foundItemService.getFoundItemById(id);
        if (itemOpt.isPresent()) {
            FoundItem item = itemOpt.get();
            item.setClaimed(true);
            item.setStatus("CLOSED");
            FoundItem updatedItem = foundItemService.updateFoundItem(item);
            return ResponseEntity.ok(updatedItem);
        }
        return ResponseEntity.notFound().build();
    }
}

