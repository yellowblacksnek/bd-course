package com.example.bd_back.controllers;

import com.example.bd_back.entities.Message;
import com.example.bd_back.entities.Visa;
import com.example.bd_back.entities.VisaApplication;
import com.example.bd_back.entities.VisaCheck;
import com.example.bd_back.repositories.VisaApplicationRepository;
import com.example.bd_back.repositories.VisaCheckRepository;
import com.example.bd_back.repositories.VisasRepository;
import com.example.bd_back.specifications.DefaultSpecificationsBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

import static com.example.bd_back.controllers.ApiController.checkEmpty;
import static com.example.bd_back.controllers.ApiController.getSQLExceptionMessage;

@RestController
public class VisasController {
    @Autowired
    private VisaCheckRepository visaCheckRepository;
    @Autowired
    private VisasRepository visasRepository;
    @Autowired
    private VisaApplicationRepository visaApplicationRepository;

    @PostMapping("/api/visaApplications/createCheck")
    public ResponseEntity createCheck(@RequestBody HashMap<String, String> req) {
        try {
            checkEmpty("visaApplications:createCheck", req, null);
            visaCheckRepository.createCheck(
                    Integer.parseInt(req.get("app_id")),
                    Integer.parseInt(req.get("employee")));
        } catch (Exception e) {
            return new ResponseEntity(getSQLExceptionMessage(e, getClass()), new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity("", new HttpHeaders(), HttpStatus.CREATED);
    }

    @PostMapping("/api/visaApplications/deleteCheck")
    public ResponseEntity deleteCheck(@RequestBody HashMap<String, String> req) {
        try {
            checkEmpty("visaApplications:deleteCheck", req, null);
            visaCheckRepository.deleteCheck(Integer.parseInt(req.get("id")));
        } catch (Exception e) {
            return new ResponseEntity(getSQLExceptionMessage(e, getClass()), new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity("", new HttpHeaders(), HttpStatus.NO_CONTENT);
    }

    @PostMapping("/api/visaApplications/finishCheck")
    public ResponseEntity finishCheck(@RequestBody HashMap<String, String> req) {
        try {
            checkEmpty("visaApplications:finishCheck", req, new String[]{"comment"});
            int res = visaCheckRepository.finishCheck(
                    Integer.parseInt(req.get("id")),
                    req.get("verdict"),
                    req.get("comment"));
            System.out.println(res);
        } catch (Exception e) {
            return new ResponseEntity(getSQLExceptionMessage(e, getClass()), new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity("", new HttpHeaders(), HttpStatus.OK);
    }

    @PostMapping("/api/visas/create")
    public ResponseEntity createVisa(@RequestBody HashMap<String, String> req) {
        try {
            checkEmpty("visas:createVisa", req, null);
            int res = visasRepository.createVisa(Integer.parseInt(req.get("application")));
            System.out.println(res);
        } catch (Exception e) {
            return new ResponseEntity(getSQLExceptionMessage(e, getClass()), new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity("", new HttpHeaders(), HttpStatus.OK);
    }

    @GetMapping("/api/visas/searchBy")
    public ResponseEntity searchVisas(@RequestParam HashMap<String, String> req, Pageable pageable) {
        try {
            Specification<Visa> spec = new DefaultSpecificationsBuilder<Visa>().build(req);
            Page<Visa> res = visasRepository.findAll(spec, pageable);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return new ResponseEntity(getSQLExceptionMessage(e, getClass()), new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/api/visaChecks/searchBy")
    public ResponseEntity searchVisaChecks(@RequestParam HashMap<String, String> req, Pageable pageable) {
        try {
            Specification<VisaCheck> spec = new DefaultSpecificationsBuilder<VisaCheck>().build(req);
            Page<VisaCheck> res = visaCheckRepository.findAll(spec, pageable);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return new ResponseEntity(getSQLExceptionMessage(e, getClass()), new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/api/visaApplications/searchBy")
    public ResponseEntity searchVisaApplications(@RequestParam HashMap<String, String> req, Pageable pageable) {
        try {
            Specification<VisaApplication> spec = new DefaultSpecificationsBuilder<VisaApplication>().build(req);
            Page<VisaApplication> res = visaApplicationRepository.findAll(spec, pageable);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return new ResponseEntity(getSQLExceptionMessage(e, getClass()), new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
    }
}
