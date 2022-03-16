package com.example.bd_back.controllers;

import com.example.bd_back.entities.Employee;
import com.example.bd_back.entities.Message;
import com.example.bd_back.entities.MsgExchange;
import com.example.bd_back.repositories.MessagesRepository;
import com.example.bd_back.repositories.MsgExchangeRepository;
import com.example.bd_back.specifications.DefaultSpecificationsBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.Optional;

import static com.example.bd_back.controllers.ApiController.checkEmpty;
import static com.example.bd_back.controllers.ApiController.getSQLExceptionMessage;

@RestController
public class MessagesController {
    @Autowired
    private MessagesRepository messagesRepository;
    @Autowired
    private MsgExchangeRepository exchangesRepository;

    @PostMapping("/api/messages/create")
    public ResponseEntity createMessage(@RequestBody HashMap<String, String> req) {
        try {
            checkEmpty("createMessage", req, null);
            Message message = messagesRepository.createMessage(
                    req.get("content"),
                    Long.parseLong(req.get("sender")),
                    Long.parseLong(req.get("recipient")));
            return new ResponseEntity(message, new HttpHeaders(), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity(getSQLExceptionMessage(e, getClass()), new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/api/msgExchanges/schedule")
    public ResponseEntity scheduleMessage(@RequestBody HashMap<String, String> req) {
        try {
            checkEmpty("scheduleMessage", req, null);

            Instant time = Instant.parse(req.get("time"));
            Instant now = LocalDateTime.now().toInstant(ZoneOffset.UTC);
            System.out.println(time.getEpochSecond());
            System.out.println(now.getEpochSecond());
            messagesRepository.scheduleMessage(
                    Integer.parseInt(req.get("id")),
                    Integer.parseInt(req.get("employee")),
                    Integer.parseInt(req.get("room")),
                    Instant.parse(req.get("time")));
        } catch (Exception e) {
            return new ResponseEntity(getSQLExceptionMessage(e, getClass()), new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity("", new HttpHeaders(), HttpStatus.CREATED);
    }

    @PostMapping("/api/msgExchanges/unschedule")
    public ResponseEntity unscheduleMessage(@RequestBody HashMap<String, String> req) {
        try {
            checkEmpty("unscheduleMessage", req, null);
            exchangesRepository.unscheduleExchange(Integer.parseInt(req.get("id")));
        } catch (Exception e) {
            return new ResponseEntity(getSQLExceptionMessage(e, getClass()), new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity("", new HttpHeaders(), HttpStatus.CREATED);
    }

    @PostMapping("/api/msgExchanges/report")
    public ResponseEntity reportExchange(@RequestBody HashMap<String, String> req) {
        try {
            checkEmpty("reportExchange", req, new String[]{"text"});
            Optional<MsgExchange> exc = exchangesRepository.findById(Integer.parseInt(req.get("id")));
            if(exc.isPresent()) {
                Instant now = LocalDateTime.now().toInstant(ZoneOffset.UTC);
                Instant time = exc.get().getExcTime();
                if(time.getEpochSecond() > now.getEpochSecond()) {
                    throw new Exception("too early for exchange");
                }
            } else {
                throw new Exception("no exchange found");
            }
            exchangesRepository.reportExchange(
                    req.get("state"),
                    Integer.parseInt(req.get("id")),
                    req.get("text"));
        } catch (Exception e) {
            return new ResponseEntity(getSQLExceptionMessage(e, getClass()), new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity("", new HttpHeaders(), HttpStatus.CREATED);
    }

    @GetMapping("/api/messages/searchBy")
    public ResponseEntity searchMessages(@RequestParam HashMap<String, String> req, Pageable pageable) {
        try {
            Specification<Message> spec = new DefaultSpecificationsBuilder<Message>().build(req);
            Page<Message> res = messagesRepository.findAll(spec, pageable);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return new ResponseEntity(getSQLExceptionMessage(e, getClass()), new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/api/msgExchanges/searchBy")
    public ResponseEntity searchMsgExchanges(@RequestParam HashMap<String, String> req, Pageable pageable) {
        try {
            Specification<MsgExchange> spec = new DefaultSpecificationsBuilder<MsgExchange>().build(req);
            Page<MsgExchange> res = exchangesRepository.findAll(spec, pageable);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return new ResponseEntity(getSQLExceptionMessage(e, getClass()), new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
    }

}
