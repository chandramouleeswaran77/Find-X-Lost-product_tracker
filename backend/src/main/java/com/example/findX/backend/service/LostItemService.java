package com.example.findX.backend.service;

import com.example.findX.backend.model.LostItem;
import com.example.findX.backend.model.FoundItem;
import com.example.findX.backend.repository.LostItemRepository;
import com.example.findX.backend.repository.FoundItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Service
public class LostItemService {
    
    @Autowired
    private LostItemRepository lostItemRepository;
    
    @Autowired
    private FoundItemRepository foundItemRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    public List<LostItem> getAllLostItems() {
        return lostItemRepository.findByResolvedFalse();
    }
    
    public List<LostItem> searchLostItems(String searchTerm) {
        return lostItemRepository.findByNameContainingIgnoreCase(searchTerm);
    }
    
    public LostItem createLostItem(LostItem lostItem) {
        lostItem.setCreatedAt(LocalDateTime.now());
        lostItem.setResolved(false);
        lostItem.setStatus("OPEN");
        lostItem.setNotified(false);
        
        LostItem savedItem = lostItemRepository.save(lostItem);
        
        // Check for matches with found items
        checkForMatches(savedItem);
        
        return savedItem;
    }
    
    public Optional<LostItem> getLostItemById(String id) {
        return lostItemRepository.findById(id);
    }
    
    public LostItem updateLostItem(LostItem lostItem) {
        return lostItemRepository.save(lostItem);
    }
    
    public void deleteLostItem(String id) {
        lostItemRepository.deleteById(id);
    }
    
    private void checkForMatches(LostItem lostItem) {
        List<FoundItem> foundItems = foundItemRepository.findByClaimedFalse();
        
        for (FoundItem foundItem : foundItems) {
            if (isMatch(lostItem, foundItem)) {
                // Mark both items as possible match
                lostItem.setStatus("POSSIBLE_MATCH");
                lostItem.setMatchedWith(foundItem.getId());
                lostItemRepository.save(lostItem);
                
                foundItem.setStatus("POSSIBLE_MATCH");
                foundItem.setMatchedWith(lostItem.getId());
                foundItemRepository.save(foundItem);
                
                // Send notifications
                notificationService.notifyMatch(
                    lostItem.getPostedBy(),
                    foundItem.getPostedBy(),
                    lostItem.getId(),
                    foundItem.getId(),
                    lostItem.getItem()
                );
                
                // Mark as notified
                lostItem.setNotified(true);
                foundItem.setNotified(true);
                lostItemRepository.save(lostItem);
                foundItemRepository.save(foundItem);
                
                break; // Only match with the first found match
            }
        }
    }
    
    private boolean isMatch(LostItem lostItem, FoundItem foundItem) {
        // Extract keywords from title and description
        Set<String> lostKeywords = extractKeywords(lostItem.getItem() + " " + lostItem.getDescription());
        Set<String> foundKeywords = extractKeywords(foundItem.getItem() + " " + foundItem.getDescription());
        
        // Calculate intersection
        Set<String> intersection = new HashSet<>(lostKeywords);
        intersection.retainAll(foundKeywords);
        
        // Consider it a match if at least 2 keywords overlap
        return intersection.size() >= 2;
    }
    
    private Set<String> extractKeywords(String text) {
        if (text == null) return new HashSet<>();
        
        // Convert to lowercase and split by non-alphanumeric characters
        String[] words = text.toLowerCase().replaceAll("[^a-zA-Z0-9\\s]", "").split("\\s+");
        
        // Filter out common stop words and short words
        Set<String> stopWords = new HashSet<>(Arrays.asList(
            "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by",
            "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did",
            "will", "would", "could", "should", "may", "might", "must", "can", "this", "that", "these", "those",
            "i", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them", "my", "your", "his", "her", "its", "our", "their"
        ));
        
        Set<String> keywords = new HashSet<>();
        for (String word : words) {
            if (word.length() > 2 && !stopWords.contains(word)) {
                keywords.add(word);
            }
        }
        
        return keywords;
    }
}
