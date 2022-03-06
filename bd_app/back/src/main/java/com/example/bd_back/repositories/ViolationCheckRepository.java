package com.example.bd_back.repositories;

import com.example.bd_back.entities.ViolationCheck;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface ViolationCheckRepository extends PagingAndSortingRepository<ViolationCheck, Integer> {
}