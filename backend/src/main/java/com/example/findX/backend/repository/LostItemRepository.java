package com.example.findX.backend.repository;

import com.example.findX.backend.model.LostItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LostItemRepository extends MongoRepository<LostItem, String> {
    List<LostItem> findByResolvedFalse();
    List<LostItem> findByNameContainingIgnoreCase(String name);
    List<LostItem> findByItem(String item);
}
