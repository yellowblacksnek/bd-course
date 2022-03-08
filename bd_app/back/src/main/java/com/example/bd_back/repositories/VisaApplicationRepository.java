package com.example.bd_back.repositories;

import com.example.bd_back.entities.VisaApplication;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface VisaApplicationRepository extends PagingAndSortingRepository<VisaApplication, Integer> {
    Iterable<VisaApplication> findByVisaAppState(VisaApplication.VisaAppStates state);

    @Procedure(value = "visa_check_create")
    int createCheck(Integer app_id, Integer employee);

    @Procedure(value = "visa_check_delete")
    int deleteCheck(Integer id);

    @Procedure(value = "visa_check_finish")
    int finishCheck(Integer id, String verdict, String com);
}