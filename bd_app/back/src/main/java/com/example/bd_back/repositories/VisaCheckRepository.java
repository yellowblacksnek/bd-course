package com.example.bd_back.repositories;

import com.example.bd_back.entities.VisaCheck;
import com.example.bd_back.entities.projections.VisaCheckInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//@RepositoryRestResource(excerptProjection = VisaCheckInfo.class)
public interface VisaCheckRepository extends PagingAndSortingRepository<VisaCheck, Integer>, JpaSpecificationExecutor<VisaCheck> {
    Page<VisaCheck> findByEmployees_id(Integer employee, Pageable pageable);

    @Procedure(value = "visa_check_create")
    int createCheck(Integer app_id, Integer employee);

    @Procedure(value = "visa_check_delete")
    int deleteCheck(Integer id);

    @Procedure(value = "visa_check_finish")
    int finishCheck(Integer id, String verdict, String com);
}