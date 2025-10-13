package com.example.findX.backend.repository;

import com.example.findX.backend.model.FoundItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoundItemRepository extends MongoRepository<FoundItem, String> {
    List<FoundItem> findByClaimedFalse();
    List<FoundItem> findByNameContainingIgnoreCase(String name);
}
