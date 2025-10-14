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
            if (isExactKeywordMatch(lostItem, foundItem) || isMatch(lostItem, foundItem)) {
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
                // Fast exact name shortcut (case-insensitive, trimmed)
                if (lostItem.getItem() != null && foundItem.getItem() != null) {
                    String a = lostItem.getItem().trim();
                    String b = foundItem.getItem().trim();
                    if (!a.isEmpty() && a.equalsIgnoreCase(b)) {
                        return true;
                    }
                }

                // Extract keywords from title and description
        Set<String> lostKeywords = extractKeywords(lostItem.getItem() + " " + lostItem.getDescription());
        Set<String> foundKeywords = extractKeywords(foundItem.getItem() + " " + foundItem.getDescription());
        
        // Calculate intersection
        Set<String> intersection = new HashSet<>(lostKeywords);
        intersection.retainAll(foundKeywords);
        
        // Enhanced matching: Consider partial matches as well
        int partialMatches = 0;
        for (String lostKeyword : lostKeywords) {
            for (String foundKeyword : foundKeywords) {
                // Check for partial string similarity (e.g., "phone" matches "iphone")
                if (lostKeyword.contains(foundKeyword) || foundKeyword.contains(lostKeyword)) {
                    partialMatches++;
                    break;
                }
            }
        }
        
        // Consider it a match if:
        // - At least 2 exact keyword overlaps, OR
        // - At least 1 exact match + 2 partial matches, OR
        // - At least 3 partial matches for longer keywords
        return intersection.size() >= 2 || 
               (intersection.size() >= 1 && partialMatches >= 2) ||
               partialMatches >= 3;
    }

    private boolean isExactKeywordMatch(LostItem lostItem, FoundItem foundItem) {
        if (lostItem == null || foundItem == null) return false;
        String a = lostItem.getItem() != null ? lostItem.getItem().trim().toLowerCase() : "";
        String b = foundItem.getItem() != null ? foundItem.getItem().trim().toLowerCase() : "";
        if (!a.isEmpty() && a.equals(b)) return true;

        Set<String> lostKeywords = extractKeywords(lostItem.getItem() + " " + lostItem.getDescription());
        Set<String> foundKeywords = extractKeywords(foundItem.getItem() + " " + foundItem.getDescription());
        // Exact keyword overlap: any identical keyword triggers a match
        for (String kw : lostKeywords) {
            if (foundKeywords.contains(kw)) {
                return true;
            }
        }
        return false;
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
            "i", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them", "my", "your", "his", "her", "its", "our", "their",
            "lost", "found", "item", "thing"
        ));
        
        Set<String> keywords = new HashSet<>();
        for (String word : words) {
            if (word.length() > 2 && !stopWords.contains(word)) {
                keywords.add(word);
                // Also add common abbreviations/variations
                if (word.equals("mobile") || word.equals("cellphone")) {
                    keywords.add("phone");
                } else if (word.equals("phone") || word.equals("cellphone")) {
                    keywords.add("mobile");
                } else if (word.equals("pods") || word.equals("earbuds")) {
                    keywords.add("airpods");
                    keywords.add("earphones");
                } else if (word.equals("wallet") || word.equals("purse")) {
                    keywords.add("wallet");
                    keywords.add("purse");
                }
            }
        }
        
        return keywords;
    }
}
