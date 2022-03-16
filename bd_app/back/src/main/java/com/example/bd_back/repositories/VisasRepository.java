package com.example.bd_back.repositories;

import com.example.bd_back.entities.Visa;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface VisasRepository extends PagingAndSortingRepository<Visa, Integer>, JpaSpecificationExecutor<Visa> {
    @Procedure(value = "visa_create")
    int createVisa(Integer application);
}