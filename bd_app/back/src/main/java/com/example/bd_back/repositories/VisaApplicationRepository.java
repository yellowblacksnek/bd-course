package com.example.bd_back.repositories;

import com.example.bd_back.entities.VisaApplication;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface VisaApplicationRepository extends PagingAndSortingRepository<VisaApplication, Integer>, JpaSpecificationExecutor<VisaApplication> {
    Iterable<VisaApplication> findByVisaAppState(VisaApplication.VisaAppStates state);
}