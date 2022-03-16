package com.example.bd_back.controllers;

import com.example.bd_back.entities.Violation;
import com.example.bd_back.entities.ViolationCheck;
import com.example.bd_back.entities.Visa;
import com.example.bd_back.entities.VisaCheck;
import com.example.bd_back.repositories.ViolationCheckRepository;
import com.example.bd_back.repositories.ViolationRepository;
import com.example.bd_back.repositories.VisaCheckRepository;
import com.example.bd_back.specifications.DefaultSpecificationsBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;

import static com.example.bd_back.controllers.ApiController.checkEmpty;
import static com.example.bd_back.controllers.ApiController.getSQLExceptionMessage;


@RestController
public class ViolationsController {
    @Autowired
    private ViolationRepository violationRepository;
    @Autowired
    private ViolationCheckRepository violationCheckRepository;

    @PostMapping("/api/violations/createCheck")
    public ResponseEntity createCheck(@RequestBody HashMap<String, String> req) {
        try {
            checkEmpty("violations:createCheck", req, null);
            violationCheckRepository.createCheck(
                    Integer.parseInt(req.get("violation")),
                    Integer.parseInt(req.get("employee")));
        } catch (Exception e) {
            return new ResponseEntity(getSQLExceptionMessage(e, getClass()), new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity("", new HttpHeaders(), HttpStatus.CREATED);
    }

    @PostMapping("/api/violations/deleteCheck")
    public ResponseEntity deleteCheck(@RequestBody HashMap<String, String> req) {
        try {
            checkEmpty("violations:deleteCheck", req, null);
            violationCheckRepository.deleteCheck(Integer.parseInt(req.get("id")));
        } catch (Exception e) {
            return new ResponseEntity(getSQLExceptionMessage(e, getClass()), new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity("", new HttpHeaders(), HttpStatus.NO_CONTENT);
    }

    @PostMapping("/api/violations/finishCheck")
    public ResponseEntity finishCheck(@RequestBody HashMap<String, String> req) {
        try {
            checkEmpty("violations:finishCheck", req, new String[]{"comment", "restriction"});
            int res = violationCheckRepository.finishCheck(
                    Integer.parseInt(req.get("id")),
                    req.get("verdict"),
                    LocalDate.parse(req.get("restriction") == null ? LocalDate.now().toString() : req.get("restriction")),
                    req.get("comment"));
            System.out.println(res);
        } catch (Exception e) {
            return new ResponseEntity(getSQLExceptionMessage(e, getClass()), new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity("", new HttpHeaders(), HttpStatus.ACCEPTED);
    }

    @GetMapping("/api/violations/searchBy")
    public ResponseEntity searchViolations(@RequestParam HashMap<String, String> req, Pageable pageable) {
        try {
            Specification<Violation> spec = new DefaultSpecificationsBuilder<Violation>().build(req);
            Page<Violation> res = violationRepository.findAll(spec, pageable);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return new ResponseEntity(getSQLExceptionMessage(e, getClass()), new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/api/violationChecks/searchBy")
    public ResponseEntity searchViolationChecks(@RequestParam HashMap<String, String> req, Pageable pageable) {
        try {
            Specification<ViolationCheck> spec = new DefaultSpecificationsBuilder<ViolationCheck>().build(req);
            Page<ViolationCheck> res = violationCheckRepository.findAll(spec, pageable);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return new ResponseEntity(getSQLExceptionMessage(e, getClass()), new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
    }
}
