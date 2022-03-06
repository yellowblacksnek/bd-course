package com.example.bd_back.controllers;

import com.example.bd_back.repositories.MessagesRepository;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.RepositoryRestExceptionHandler;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.HashMap;

@RestController
public class Controller {
    @ControllerAdvice(basePackageClasses = RepositoryRestExceptionHandler.class)
    public class GenericExceptionHandler {

        @ExceptionHandler
        ResponseEntity handle(Exception e) {
            return new ResponseEntity(getSQLExceptionMessage(e, getClass()), new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
    }

    public static String getSQLExceptionMessage(Exception e, Class srcClass) {
        LoggerFactory.getLogger(srcClass).error(e.getClass() + ":"+e.getMessage());
        String message = "Bad request";
        Throwable ex = e.getCause();
        if(ex == null) return message;
        ex = ex.getCause();
        if(ex == null) return message;
        if(ex instanceof SQLException) {
            message = ex.getMessage().split("\n")[0];
        }
        return message;
    }
}

