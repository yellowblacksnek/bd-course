package com.example.bd_back.repositories;

import com.example.bd_back.entities.Employee;
import com.example.bd_back.entities.Person;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

public interface EmployeesRepository extends PagingAndSortingRepository<Employee, Integer> {

//    @Query("select e,p.firstName,p.lastName from Employee e inner join e.person p inner join e.visaChecks c where c.id = :check_id")
//    Iterable<Employee> findByVisaChecksFetch(Integer check_id);
}
