package com.example.bd_back.repositories;

import com.example.bd_back.entities.Employee;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

public interface EmployeesRepository extends PagingAndSortingRepository<Employee, Integer> {
}
