package com.example.bd_back.entities.projections;

import com.example.bd_back.entities.*;
import org.springframework.data.rest.core.config.Projection;

import java.time.LocalDate;
import java.util.Set;

@Projection(types = ViolationCheck.class, name = "inline")
public interface ViolationCheckInfo {
    Integer getId();

    ViolationCheck.ViolationVerdicts getVerdict();

    LocalDate getRestrictUntil();

    LocalDate getVerdictDate();

    String getComment();

    Boolean getIsFinished();

    Integer getViolationId();
    ViolationInfo getViolation();

    Set<EmployeeInfo> getEmployees();

    interface ViolationInfo {
        Integer getId();

        PersonInfo getPerson();

        Integer getViolationType();

        String getDescription();

        LocalDate getIssueDate();

        Violation.ViolationStates getViolationState();
    }

    interface EmployeeInfo {
        Integer getId();

//        PersonInfo getPerson();
    }

    interface PersonInfo {
        Long getId();

        String getFirstName();

        String getLastName();

        String getBirthDim();
    }

}
