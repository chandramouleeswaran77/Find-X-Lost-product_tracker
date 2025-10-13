package com.example.findX.backend.controller;

import com.example.findX.backend.model.LostItem;
import com.example.findX.backend.service.LostItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/lost")
@CrossOrigin(origins = "http://localhost:5173")
public class LostItemController {
    
    @Autowired
    private LostItemService lostItemService;
    
    private static final String UPLOAD_DIR = "uploads/lost/";
    
    @GetMapping
    public ResponseEntity<List<LostItem>> getAllLostItems() {
        List<LostItem> lostItems = lostItemService.getAllLostItems();
        return ResponseEntity.ok(lostItems);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<LostItem>> searchLostItems(@RequestParam String q) {
        List<LostItem> lostItems = lostItemService.searchLostItems(q);
        return ResponseEntity.ok(lostItems);
    }
    
    @PostMapping
    public ResponseEntity<LostItem> createLostItem(
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
            LostItem lostItem = new LostItem();
            lostItem.setRollNo(rollNo);
            lostItem.setName(name);
            lostItem.setItem(item);
            lostItem.setLocation(location);
            lostItem.setDate(date);
            lostItem.setDescription(description);
            lostItem.setReportedBy(user);
            lostItem.setPostedBy(user);
            lostItem.setContactEmail(contactEmail);
            lostItem.setContactPhone(contactPhone);
            lostItem.setStatus("OPEN");
            
            // Handle file upload
            if (photo != null && !photo.isEmpty()) {
                String fileName = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(photo.getInputStream(), filePath);
                lostItem.setImageUrl("/uploads/lost/" + fileName);
            } else {
                lostItem.setImageUrl("https://via.placeholder.com/150");
            }
            
            LostItem savedItem = lostItemService.createLostItem(lostItem);
            return ResponseEntity.ok(savedItem);
            
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<LostItem> getLostItemById(@PathVariable String id) {
        return lostItemService.getLostItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<LostItem> updateLostItem(@PathVariable String id, @RequestBody LostItem lostItem) {
        if (lostItemService.getLostItemById(id).isPresent()) {
            lostItem.setId(id);
            LostItem updatedItem = lostItemService.updateLostItem(lostItem);
            return ResponseEntity.ok(updatedItem);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLostItem(@PathVariable String id) {
        if (lostItemService.getLostItemById(id).isPresent()) {
            lostItemService.deleteLostItem(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
