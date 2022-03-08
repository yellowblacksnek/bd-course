package com.example.bd_back.controllers;

import com.example.bd_back.repositories.VisaApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

import static com.example.bd_back.controllers.Controller.getSQLExceptionMessage;

@RestController
public class VisasController {
    @Autowired
    private VisaApplicationRepository applicationsRepository;

    @PostMapping("/api/visaApplications/createCheck")
    public ResponseEntity createCheck(@RequestBody HashMap<String, String> req) {
        try {
            applicationsRepository.createCheck(
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
            applicationsRepository.deleteCheck(Integer.parseInt(req.get("id")));
        } catch (Exception e) {
            return new ResponseEntity(getSQLExceptionMessage(e, getClass()), new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity("", new HttpHeaders(), HttpStatus.NO_CONTENT);
    }

    @PostMapping("/api/visaApplications/finishCheck")
    public ResponseEntity finishCheck(@RequestBody HashMap<String, String> req) {
        try {
            int res = applicationsRepository.finishCheck(
                    Integer.parseInt(req.get("id")),
                    req.get("verdict"),
                    req.get("comment"));
            System.out.println(res);
        } catch (Exception e) {
            return new ResponseEntity(getSQLExceptionMessage(e, getClass()), new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity("", new HttpHeaders(), HttpStatus.NO_CONTENT);
    }
}
