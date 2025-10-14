package com.example.findX.backend.controller;

import com.example.findX.backend.model.FoundItem;
import com.example.findX.backend.model.LostItem;
import com.example.findX.backend.repository.FoundItemRepository;
import com.example.findX.backend.repository.LostItemRepository;
import com.example.findX.backend.service.FoundItemService;
import com.example.findX.backend.service.LostItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminCrudController {

    @Autowired private LostItemRepository lostItemRepository;
    @Autowired private FoundItemRepository foundItemRepository;
    @Autowired private LostItemService lostItemService;
    @Autowired private FoundItemService foundItemService;

    private boolean isAdmin(String roleHeader) {
        return roleHeader != null && roleHeader.equalsIgnoreCase("ADMIN");
    }

    // Lost Items CRUD
    @GetMapping("/lost")
    public ResponseEntity<List<LostItem>> listLost(@RequestHeader(value = "X-Role", required = false) String role) {
        if (!isAdmin(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        return ResponseEntity.ok(lostItemRepository.findAll());
    }

    @PostMapping("/lost")
    public ResponseEntity<LostItem> createLost(@RequestHeader(value = "X-Role", required = false) String role,
                                               @RequestBody LostItem body) {
        if (!isAdmin(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        return ResponseEntity.ok(lostItemService.createLostItem(body));
    }

    @PutMapping("/lost/{id}")
    public ResponseEntity<LostItem> updateLost(@RequestHeader(value = "X-Role", required = false) String role,
                                               @PathVariable String id,
                                               @RequestBody LostItem body) {
        if (!isAdmin(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        Optional<LostItem> existing = lostItemRepository.findById(id);
        if (existing.isEmpty()) return ResponseEntity.notFound().build();
        body.setId(id);
        return ResponseEntity.ok(lostItemService.updateLostItem(body));
    }

    @DeleteMapping("/lost/{id}")
    public ResponseEntity<Void> deleteLost(@RequestHeader(value = "X-Role", required = false) String role,
                                           @PathVariable String id) {
        if (!isAdmin(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        lostItemService.deleteLostItem(id);
        return ResponseEntity.noContent().build();
    }

    // Found Items CRUD
    @GetMapping("/found")
    public ResponseEntity<List<FoundItem>> listFound(@RequestHeader(value = "X-Role", required = false) String role) {
        if (!isAdmin(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        return ResponseEntity.ok(foundItemRepository.findAll());
    }

    @PostMapping("/found")
    public ResponseEntity<FoundItem> createFound(@RequestHeader(value = "X-Role", required = false) String role,
                                                 @RequestBody FoundItem body) {
        if (!isAdmin(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        return ResponseEntity.ok(foundItemService.createFoundItem(body));
    }

    @PutMapping("/found/{id}")
    public ResponseEntity<FoundItem> updateFound(@RequestHeader(value = "X-Role", required = false) String role,
                                                 @PathVariable String id,
                                                 @RequestBody FoundItem body) {
        if (!isAdmin(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        Optional<FoundItem> existing = foundItemRepository.findById(id);
        if (existing.isEmpty()) return ResponseEntity.notFound().build();
        body.setId(id);
        return ResponseEntity.ok(foundItemService.updateFoundItem(body));
    }

    @DeleteMapping("/found/{id}")
    public ResponseEntity<Void> deleteFound(@RequestHeader(value = "X-Role", required = false) String role,
                                            @PathVariable String id) {
        if (!isAdmin(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        foundItemService.deleteFoundItem(id);
        return ResponseEntity.noContent().build();
    }
}
