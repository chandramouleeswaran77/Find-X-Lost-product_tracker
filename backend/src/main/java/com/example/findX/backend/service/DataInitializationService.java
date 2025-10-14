package com.example.findX.backend.service;

import com.example.findX.backend.model.FoundItem;
import com.example.findX.backend.model.LostItem;
import com.example.findX.backend.model.User;
import com.example.findX.backend.repository.FoundItemRepository;
import com.example.findX.backend.repository.LostItemRepository;
import com.example.findX.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class DataInitializationService implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private LostItemRepository lostItemRepository;
    
    @Autowired
    private FoundItemRepository foundItemRepository;

    @Autowired
    private LostItemService lostItemService;

    @Autowired
    private FoundItemService foundItemService;
    
    @Override
    public void run(String... args) throws Exception {
        // Always ensure exact-match seed exists (idempotent upsert)
        initializeSampleData();
    }
    
    private void initializeSampleData() {
        // Create sample user (idempotent)
        User adminUser = new User();
        adminUser.setUsername("admin");
        adminUser.setName("Admin User");
        adminUser.setEmail("admin@findx.com");
        adminUser.setPassword("123123");
        adminUser.setRollNo("ADMIN001");
        adminUser.setRole("ADMIN");
        adminUser.setPictureUrl(null);
        try {
            userRepository.findByEmail(adminUser.getEmail()).orElseGet(() -> userRepository.save(adminUser));
        } catch (Exception e) {
            userRepository.save(adminUser);
        }
        
        // Create sample lost items
        LostItem lostItem1 = new LostItem();
        lostItem1.setRollNo("2021001");
        lostItem1.setName("Wallet");
        lostItem1.setItem("Black Leather Wallet");
        lostItem1.setLocation("Campus Library");
        lostItem1.setDate("2025-10-05");
        lostItem1.setDescription("A black leather wallet with student ID and a few cards.");
        lostItem1.setImageUrl("https://via.placeholder.com/150");
        lostItem1.setReportedBy("admin");
        lostItem1.setCreatedAt(LocalDateTime.now());
        lostItem1.setResolved(false);
        lostItem1.setPostedBy(adminUser.getEmail());
        lostItem1.setContactEmail(adminUser.getEmail());
        lostItem1.setStatus("OPEN");
        if (lostItem1.getId() == null) {
            lostItem1 = lostItemRepository.save(lostItem1);
        }
        
        LostItem lostItem2 = new LostItem();
        lostItem2.setRollNo("2021002");
        lostItem2.setName("Water Bottle");
        lostItem2.setItem("Blue Thermosteel Bottle");
        lostItem2.setLocation("Canteen");
        lostItem2.setDate("2025-10-03");
        lostItem2.setDescription("A blue bottle with a white sticker on top.");
        lostItem2.setImageUrl("https://via.placeholder.com/150");
        lostItem2.setReportedBy("admin");
        lostItem2.setCreatedAt(LocalDateTime.now());
        lostItem2.setResolved(false);
        lostItem2.setPostedBy(adminUser.getEmail());
        lostItem2.setContactEmail(adminUser.getEmail());
        lostItem2.setStatus("OPEN");
        if (lostItem2.getId() == null) {
            lostItem2 = lostItemRepository.save(lostItem2);
        }
        
        LostItem lostItem3 = new LostItem();
        lostItem3.setRollNo("2021003");
        lostItem3.setName("Mobile");
        lostItem3.setItem("lost mobile");
        lostItem3.setLocation("as block");
        lostItem3.setDate("2025-10-03");
        lostItem3.setDescription("lost mobile");
        lostItem3.setImageUrl("https://via.placeholder.com/150");
        lostItem3.setReportedBy("admin");
        lostItem3.setCreatedAt(LocalDateTime.now());
        lostItem3.setResolved(false);
        lostItem3.setPostedBy(adminUser.getEmail());
        lostItem3.setContactEmail(adminUser.getEmail());
        lostItem3.setStatus("OPEN");
        if (lostItem3.getId() == null) {
            lostItem3 = lostItemRepository.save(lostItem3);
        }
        
        // Create sample found items
        FoundItem foundItem1 = new FoundItem();
        foundItem1.setRollNo("2022001");
        foundItem1.setName("Sample Found Phone");
        foundItem1.setItem("Black Samsung Galaxy");
        foundItem1.setLocation("Campus Cafeteria");
        foundItem1.setDate("2025-10-05");
        foundItem1.setDescription("A black Samsung Galaxy phone with a cracked screen protector.");
        foundItem1.setImageUrl("https://via.placeholder.com/150");
        foundItem1.setReportedBy("admin");
        foundItem1.setCreatedAt(LocalDateTime.now());
        foundItem1.setClaimed(false);
        foundItem1.setPostedBy(adminUser.getEmail());
        foundItem1.setContactEmail(adminUser.getEmail());
        foundItem1.setStatus("OPEN");
        if (foundItem1.getId() == null) {
            foundItem1 = foundItemRepository.save(foundItem1);
        }
        
        FoundItem foundItem2 = new FoundItem();
        foundItem2.setRollNo("2022002");
        foundItem2.setName("Sample Backpack");
        foundItem2.setItem("Grey Laptop Backpack");
        foundItem2.setLocation("Library Entrance");
        foundItem2.setDate("2025-10-02");
        foundItem2.setDescription("Grey backpack containing books and a pencil pouch.");
        foundItem2.setImageUrl("https://via.placeholder.com/150");
        foundItem2.setReportedBy("admin");
        foundItem2.setCreatedAt(LocalDateTime.now());
        foundItem2.setClaimed(false);
        foundItem2.setPostedBy(adminUser.getEmail());
        foundItem2.setContactEmail(adminUser.getEmail());
        foundItem2.setStatus("OPEN");
        if (foundItem2.getId() == null) {
            foundItem2 = foundItemRepository.save(foundItem2);
        }

        // Add an exact-match pair to exercise matching & email
        LostItem exactLost = lostItemRepository.findByItem("Blue Bottle").stream().findFirst().orElse(new LostItem());
        exactLost.setRollNo("2021999");
        exactLost.setName("Earbuds");
        exactLost.setItem("Blue Bottle");
        exactLost.setLocation("Main Gate");
        exactLost.setDate("2025-10-06");
        exactLost.setDescription("Blue Bottle with sticker X");
        exactLost.setImageUrl("https://via.placeholder.com/150");
        exactLost.setReportedBy(adminUser.getEmail());
        exactLost.setPostedBy(adminUser.getEmail());
        exactLost.setContactEmail(adminUser.getEmail());
        exactLost.setCreatedAt(LocalDateTime.now());
        exactLost.setResolved(false);
        exactLost.setStatus("OPEN");
        exactLost = lostItemRepository.save(exactLost);

        FoundItem exactFound = foundItemRepository.findByItem("Blue Bottle").stream().findFirst().orElse(new FoundItem());
        exactFound.setRollNo("2022999");
        exactFound.setName("Bottle");
        exactFound.setItem("Blue Bottle");
        exactFound.setLocation("Main Gate");
        exactFound.setDate("2025-10-06");
        exactFound.setDescription("Blue Bottle with sticker X");
        exactFound.setImageUrl("https://via.placeholder.com/150");
        exactFound.setReportedBy(adminUser.getEmail());
        exactFound.setPostedBy(adminUser.getEmail());
        exactFound.setContactEmail(adminUser.getEmail());
        exactFound.setCreatedAt(LocalDateTime.now());
        exactFound.setClaimed(false);
        exactFound.setStatus("OPEN");
        exactFound = foundItemRepository.save(exactFound);

        // Trigger service-level matching logic (also sends notifications/emails)
        try {
            lostItemService.updateLostItem(exactLost);
            foundItemService.updateFoundItem(exactFound);
            System.out.println("[Init] Exact-match pair ensured and matching triggered.");
        } catch (Exception e) {
            System.out.println("[Init] Matching trigger failed: " + e.getMessage());
        }
        
        System.out.println("Sample data ensured successfully!");
    }
}
