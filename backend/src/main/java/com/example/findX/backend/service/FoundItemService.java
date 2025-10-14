package com.example.findX.backend.service;

import com.example.findX.backend.model.FoundItem;
import com.example.findX.backend.model.LostItem;
import com.example.findX.backend.repository.FoundItemRepository;
import com.example.findX.backend.repository.LostItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Service
public class FoundItemService {
    
    @Autowired
    private FoundItemRepository foundItemRepository;
    
    @Autowired
    private LostItemRepository lostItemRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    public List<FoundItem> getAllFoundItems() {
        return foundItemRepository.findByClaimedFalse();
    }
    
    public List<FoundItem> searchFoundItems(String searchTerm) {
        return foundItemRepository.findByNameContainingIgnoreCase(searchTerm);
    }
    
    public FoundItem createFoundItem(FoundItem foundItem) {
        foundItem.setCreatedAt(LocalDateTime.now());
        foundItem.setClaimed(false);
        foundItem.setStatus("OPEN");
        foundItem.setNotified(false);
        
        FoundItem savedItem = foundItemRepository.save(foundItem);
        
        // Check for matches with lost items
        checkForMatches(savedItem);
        
        return savedItem;
    }
    
    public Optional<FoundItem> getFoundItemById(String id) {
        return foundItemRepository.findById(id);
    }
    
    public FoundItem updateFoundItem(FoundItem foundItem) {
        return foundItemRepository.save(foundItem);
    }
    
    public void deleteFoundItem(String id) {
        foundItemRepository.deleteById(id);
    }
    
    public FoundItem verifyClaim(String itemId, String userId, String idProof, String description) {
        Optional<FoundItem> foundItemOpt = foundItemRepository.findById(itemId);
        if (foundItemOpt.isPresent()) {
            FoundItem foundItem = foundItemOpt.get();
            // Move to pending state for admin review
            foundItem.setStatus("PENDING_CLAIM");
            foundItem.setPendingClaimUserId(userId);
            foundItem.setClaimDescription(description);
            foundItem.setClaimIdProof(idProof);
            
            // Notify user and admin
            notificationService.sendClaimNotification(userId, itemId, foundItem.getItem());
            notificationService.notifyAdmin("User " + userId + " submitted a claim for '" + foundItem.getItem() + "'.");
            
            return foundItemRepository.save(foundItem);
        }
        return null;
    }

    public Optional<FoundItem> approveClaim(String itemId) {
        Optional<FoundItem> foundItemOpt = foundItemRepository.findById(itemId);
        if (foundItemOpt.isPresent()) {
            FoundItem foundItem = foundItemOpt.get();
            foundItem.setStatus("CLOSED");
            foundItem.setClaimed(true);
            FoundItem saved = foundItemRepository.save(foundItem);
            if (foundItem.getPendingClaimUserId() != null) {
                notificationService.sendClaimApproval(foundItem.getPendingClaimUserId(), itemId, foundItem.getItem());
                notificationService.sendClaimDecisionEmail(
                    foundItem.getPendingClaimUserId(),
                    true,
                    foundItem.getItem()
                );
            }
            return Optional.of(saved);
        }
        return Optional.empty();
    }

    public Optional<FoundItem> declineClaim(String itemId, String reason) {
        Optional<FoundItem> foundItemOpt = foundItemRepository.findById(itemId);
        if (foundItemOpt.isPresent()) {
            FoundItem foundItem = foundItemOpt.get();
            // Reset claim-related fields but keep the item open for future claims
            String claimedUser = foundItem.getPendingClaimUserId();
            foundItem.setStatus("OPEN");
            foundItem.setPendingClaimUserId(null);
            foundItem.setClaimDescription(null);
            foundItem.setClaimIdProof(null);
            FoundItem saved = foundItemRepository.save(foundItem);
            if (claimedUser != null) {
                notificationService.createNotification(
                    claimedUser,
                    "Your claim was declined" + (reason != null && !reason.isBlank() ? ": " + reason : "."),
                    itemId,
                    "FOUND",
                    "CLAIM"
                );
                notificationService.sendClaimDecisionEmail(
                    claimedUser,
                    false,
                    foundItem.getItem()
                );
            }
            return Optional.of(saved);
        }
        return Optional.empty();
    }
    
    private void checkForMatches(FoundItem foundItem) {
        List<LostItem> lostItems = lostItemRepository.findByResolvedFalse();
        
        for (LostItem lostItem : lostItems) {
            if (isExactKeywordMatch(foundItem, lostItem) || isMatch(foundItem, lostItem)) {
                // Mark both items as possible match
                foundItem.setStatus("POSSIBLE_MATCH");
                foundItem.setMatchedWith(lostItem.getId());
                foundItemRepository.save(foundItem);
                
                lostItem.setStatus("POSSIBLE_MATCH");
                lostItem.setMatchedWith(foundItem.getId());
                lostItemRepository.save(lostItem);
                
                // Send notifications
                notificationService.notifyMatch(
                    lostItem.getPostedBy(),
                    foundItem.getPostedBy(),
                    lostItem.getId(),
                    foundItem.getId(),
                    foundItem.getItem()
                );
                
                // Mark as notified
                foundItem.setNotified(true);
                lostItem.setNotified(true);
                foundItemRepository.save(foundItem);
                lostItemRepository.save(lostItem);
                
                break; // Only match with the first found match
            }
        }
    }
    
            private boolean isMatch(FoundItem foundItem, LostItem lostItem) {
                // Fast exact name shortcut (case-insensitive, trimmed)
                if (foundItem.getItem() != null && lostItem.getItem() != null) {
                    String a = foundItem.getItem().trim();
                    String b = lostItem.getItem().trim();
                    if (!a.isEmpty() && a.equalsIgnoreCase(b)) {
                        return true;
                    }
                }

                // Extract keywords from title and description
        Set<String> foundKeywords = extractKeywords(foundItem.getItem() + " " + foundItem.getDescription());
        Set<String> lostKeywords = extractKeywords(lostItem.getItem() + " " + lostItem.getDescription());
        
        // Calculate intersection
        Set<String> intersection = new HashSet<>(foundKeywords);
        intersection.retainAll(lostKeywords);
        
        // Enhanced matching: Consider partial matches as well
        int partialMatches = 0;
        for (String foundKeyword : foundKeywords) {
            for (String lostKeyword : lostKeywords) {
                // Check for partial string similarity (e.g., "phone" matches "iphone")
                if (foundKeyword.contains(lostKeyword) || lostKeyword.contains(foundKeyword)) {
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

    private boolean isExactKeywordMatch(FoundItem foundItem, LostItem lostItem) {
        if (foundItem == null || lostItem == null) return false;
        String a = foundItem.getItem() != null ? foundItem.getItem().trim().toLowerCase() : "";
        String b = lostItem.getItem() != null ? lostItem.getItem().trim().toLowerCase() : "";
        if (!a.isEmpty() && a.equals(b)) return true;

        Set<String> foundKeywords = extractKeywords(foundItem.getItem() + " " + foundItem.getDescription());
        Set<String> lostKeywords = extractKeywords(lostItem.getItem() + " " + lostItem.getDescription());
        for (String kw : foundKeywords) {
            if (lostKeywords.contains(kw)) {
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
