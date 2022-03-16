package com.example.bd_back.entities.projections;

import com.example.bd_back.entities.Employee;
import com.example.bd_back.entities.Person;
import org.springframework.data.rest.core.config.Projection;

import java.time.LocalDate;
import java.util.Set;

@Projection(types = Employee.class, name = "inline")
public interface EmployeeInfo {
    Integer getId();

    LocalDate getEmploymentDate();

    String getAccLvl();

    PersonInfo getPerson();
    Long getPersonId();
//    Person.Dimensions getPersonDim();

    Set<PositionInfo> getPositions();

    interface PersonInfo {
        Long getId();

        String getFirstName();

        String getLastName();

        String getBirthDim();

        Boolean getKnows();
    }

    interface PositionInfo {
        Integer getId();

        String getDepartment();

        String getName();

        String getAccLvl();
    }
}
