package com.example.findX.backend.controller;

import com.example.findX.backend.model.FoundItem;
import com.example.findX.backend.model.LostItem;
import com.example.findX.backend.service.FoundItemService;
import com.example.findX.backend.service.LostItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "http://localhost:5173")
public class SearchController {
    
    @Autowired
    private LostItemService lostItemService;
    
    @Autowired
    private FoundItemService foundItemService;
    
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchItems(
            @RequestParam String q,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status) {
        
        Map<String, Object> results = new HashMap<>();
        List<LostItem> lostItems = new ArrayList<>();
        List<FoundItem> foundItems = new ArrayList<>();
        
        // Search lost items if type is not specified or is "lost"
        if (type == null || "lost".equalsIgnoreCase(type)) {
            lostItems = lostItemService.searchLostItems(q);
            if (status != null) {
                lostItems = lostItems.stream()
                    .filter(item -> status.equalsIgnoreCase(item.getStatus()))
                    .toList();
            }
        }
        
        // Search found items if type is not specified or is "found"
        if (type == null || "found".equalsIgnoreCase(type)) {
            foundItems = foundItemService.searchFoundItems(q);
            if (status != null) {
                foundItems = foundItems.stream()
                    .filter(item -> status.equalsIgnoreCase(item.getStatus()))
                    .toList();
            }
        }
        
        results.put("lostItems", lostItems);
        results.put("foundItems", foundItems);
        results.put("totalResults", lostItems.size() + foundItems.size());
        
        return ResponseEntity.ok(results);
    }
}
