package com.example.bd_back.controllers;

import com.example.bd_back.entities.Message;
import com.example.bd_back.entities.MsgExchange;
import com.example.bd_back.repositories.MessagesRepository;
import com.example.bd_back.repositories.MsgExchangeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

import static com.example.bd_back.controllers.Controller.getSQLExceptionMessage;

@RestController
public class MessagesController {
    @Autowired
    private MessagesRepository messagesRepository;
    @Autowired
    private MsgExchangeRepository exchangesRepository;

    @PostMapping("/api/messages/schedule")
    public ResponseEntity scheduleMessage(@RequestBody HashMap<String, String> req) {

        if(messagesRepository == null) System.out.println("aboba");

        try {
            messagesRepository.scheduleMessage(
                    Integer.parseInt(req.get("id")),
                    Integer.parseInt(req.get("employee")),
                    Integer.parseInt(req.get("room")),
                    LocalDateTime.parse(req.get("time")));
        } catch (Exception e) {
            return new ResponseEntity(getSQLExceptionMessage(e, getClass()), new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity("", new HttpHeaders(), HttpStatus.CREATED);
    }

    @PostMapping("/api/msgExchanges/report")
    public ResponseEntity reportExchange(@RequestBody HashMap<String, String> req) {
        System.out.println(req.get("text"));

        try {
            exchangesRepository.reportExchange(
                    req.get("state"),
                    Integer.parseInt(req.get("id")),
                    req.get("text"));
        } catch (Exception e) {
            return new ResponseEntity(getSQLExceptionMessage(e, getClass()), new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity("", new HttpHeaders(), HttpStatus.CREATED);
    }

}
