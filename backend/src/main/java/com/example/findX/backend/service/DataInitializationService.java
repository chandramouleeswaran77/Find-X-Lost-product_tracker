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
    
    @Override
    public void run(String... args) throws Exception {
        // Initialize sample data if database is empty
        if (userRepository.count() == 0) {
            initializeSampleData();
        }
    }
    
    private void initializeSampleData() {
        // Create sample user
        User adminUser = new User();
        adminUser.setUsername("admin");
        adminUser.setName("Admin User");
        adminUser.setEmail("admin@findx.com");
        adminUser.setPassword("123123");
        adminUser.setRollNo("ADMIN001");
        adminUser.setRole("ADMIN");
        adminUser.setPictureUrl(null);
        userRepository.save(adminUser);
        
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
        lostItemRepository.save(lostItem1);
        
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
        lostItemRepository.save(lostItem2);
        
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
        lostItemRepository.save(lostItem3);
        
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
        foundItemRepository.save(foundItem1);
        
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
        foundItemRepository.save(foundItem2);
        
        System.out.println("Sample data initialized successfully!");
    }
}
