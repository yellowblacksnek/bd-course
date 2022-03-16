package com.example.bd_back.controllers;

import com.example.bd_back.entities.Employee;
import com.example.bd_back.entities.Message;
import com.example.bd_back.entities.Person;
import com.example.bd_back.entities.projections.EmployeeInfo;
import com.example.bd_back.repositories.EmployeesRepository;
import com.example.bd_back.repositories.PeopleRepository;
import com.example.bd_back.specifications.DefaultSpecification;
import com.example.bd_back.specifications.DefaultSpecificationsBuilder;
import com.example.bd_back.specifications.SearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.rest.webmvc.PersistentEntityResource;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;

import static com.example.bd_back.controllers.ApiController.checkEmpty;
import static com.example.bd_back.controllers.ApiController.getSQLExceptionMessage;

@RestController
public class EmployeesController {

    @Autowired
    private EmployeesRepository employeesRepository;

    @Autowired
    private PeopleRepository peopleRepository;

    @PostMapping("/api/employees/create")
    public ResponseEntity hireEmployee(@RequestBody HashMap<String, String> req) {
        try {
            checkEmpty("hireEmployee", req, null);
            Integer id = employeesRepository.hireEmployee(
                    Long.parseLong(req.get("person")),
                    Integer.parseInt(req.get("position")),
                    req.get("access"),
                    LocalDate.parse(req.get("date")));
            return new ResponseEntity(id, new HttpHeaders(), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity(getSQLExceptionMessage(e, getClass()), new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/api/people/searchBy")
    public ResponseEntity searchPeople(@RequestParam HashMap<String, String> req, Pageable pageable) {
        try {
            Specification<Person> spec = new DefaultSpecificationsBuilder<Person>().build(req);
            Page<Person> res = peopleRepository.findAll(spec, pageable);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return new ResponseEntity(getSQLExceptionMessage(e, getClass()), new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/api/employees/searchBy")
    public ResponseEntity searchEmployees(@RequestParam HashMap<String, String> req, Pageable pageable) {
        try {
            Specification<Employee> spec = new DefaultSpecificationsBuilder<Employee>().build(req);
            Page<Employee> res = employeesRepository.findAll(spec, pageable);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return new ResponseEntity(getSQLExceptionMessage(e, getClass()), new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
    }
}
