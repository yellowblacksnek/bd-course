package com.example.bd_back.repositories;

import com.example.bd_back.entities.Visa;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface VisaRepository extends PagingAndSortingRepository<Visa, Integer> {
}