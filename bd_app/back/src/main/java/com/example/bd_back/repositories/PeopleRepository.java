package com.example.bd_back.repositories;

import com.example.bd_back.entities.Person;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@RepositoryRestResource(collectionResourceRel = "people", path = "people")
public interface PeopleRepository extends PagingAndSortingRepository<Person, Long>, JpaSpecificationExecutor<Person> {
//    Person findById(long id);
    List<Person> findByCounterpartIsNotNull();

    @Query("select p from Person p " +
            "where p.counterpart is not null and (p.knows=:knows or p.knows=true) " +
            "and p.birthDim = (select a.birthDim from Person a where a.id = -1)" +
            "and p.id <> -1 " +
            "and 0 = (select count(e) from Employee e where e.person=(select c from Person c where c.id = p.counterpart) " +
            "and exists(select pos from e.positions pos where pos.department='interface') and false=:knows)")
    Page<Person> findRecruitable(Boolean knows, Pageable pageable);
}
