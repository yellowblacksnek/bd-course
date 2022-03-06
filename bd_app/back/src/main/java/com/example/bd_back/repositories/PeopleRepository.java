package com.example.bd_back.repositories;

import com.example.bd_back.entities.Person;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(collectionResourceRel = "people", path = "people")
public interface PeopleRepository extends PagingAndSortingRepository<Person, Long> {
//    Person findById(long id);
    List<Person> findByCounterpartIsNotNull();
}
