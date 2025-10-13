package com.example.findX.backend.repository;

import com.example.findX.backend.model.ContactRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRequestRepository extends MongoRepository<ContactRequest, String> {
    List<ContactRequest> findByProcessedFalse();
    List<ContactRequest> findByItemName(String itemName);
}
