package com.example.bd_back.repositories;

import com.example.bd_back.entities.projections.ViolationCheckInfo;
import com.example.bd_back.entities.ViolationCheck;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.time.LocalDate;

//@RepositoryRestResource(excerptProjection = ViolationCheckInfo.class)
public interface ViolationCheckRepository extends PagingAndSortingRepository<ViolationCheck, Integer>, JpaSpecificationExecutor<ViolationCheck> {
    Page<ViolationCheck> findByEmployees_id(Integer employee, Pageable pageable);

    @Procedure(value = "violation_check_create")
    int createCheck(Integer violation, Integer employee);

    @Procedure(value = "violation_check_delete")
    int deleteCheck(Integer id);

    @Procedure(value = "violation_finish")
    int finishCheck(Integer id, String verdict, LocalDate restriction, String com);
}