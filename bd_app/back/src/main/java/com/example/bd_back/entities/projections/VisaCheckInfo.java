package com.example.bd_back.entities.projections;

import com.example.bd_back.entities.*;
import org.springframework.data.rest.core.config.Projection;

import java.time.LocalDate;
import java.util.Set;

@Projection(types = VisaCheck.class, name = "inline")
public interface VisaCheckInfo {
    Integer getId();

    String getComment();

    Boolean getIsFinished();

    VisaApplication.VisaVerdicts getVerdict();
    LocalDate getVerdictDate();

    Integer getVisaAppId();
    VisaApplicationInfo getVisaApp();

    Set<EmployeeInfo> getEmployees();

    interface VisaApplicationInfo {
        Integer getId();

        PersonInfo getPerson();

        LocalDate getApplicationDate();

        LocalDate getStartDate();

        LocalDate getExpDate();

        Integer getTrans();

        VisaApplication.VisaAppStates getVisaAppState();
    }

    interface EmployeeInfo {
        Integer getId();
    }

    interface PersonInfo {
        Long getId();

        String getFirstName();

        String getLastName();

        String getBirthDim();
    }
}
