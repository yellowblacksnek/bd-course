package com.example.bd_back.repositories;

import com.example.bd_back.entities.ViolationType;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface ViolationTypeRepository extends PagingAndSortingRepository<ViolationType, Integer> {
}