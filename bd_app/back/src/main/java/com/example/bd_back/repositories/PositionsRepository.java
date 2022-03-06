package com.example.bd_back.repositories;

import com.example.bd_back.entities.Position;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

public interface PositionsRepository extends PagingAndSortingRepository<Position, Long> {
}
