package com.example.bd_back.repositories;

import com.example.bd_back.entities.Violation;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface ViolationRepository extends PagingAndSortingRepository<Violation, Integer>, JpaSpecificationExecutor<Violation> {

    Iterable<Violation> findByViolationState(Violation.ViolationStates state);
}