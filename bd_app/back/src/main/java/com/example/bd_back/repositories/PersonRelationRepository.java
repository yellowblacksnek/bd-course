package com.example.bd_back.repositories;

import com.example.bd_back.entities.PersonRelation;
import com.example.bd_back.entities.PersonRelationId;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface PersonRelationRepository extends PagingAndSortingRepository<PersonRelation, PersonRelationId> {
}