package com.example.bd_back.controllers;

import com.example.bd_back.entities.Person;
import com.example.bd_back.repositories.MessagesRepository;
import com.example.bd_back.specifications.DefaultSpecificationsBuilder;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.webmvc.RepositoryRestExceptionHandler;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

@RestController
public class ApiController {
    @ControllerAdvice(basePackageClasses = RepositoryRestExceptionHandler.class)
    public class GenericExceptionHandler {

        @ExceptionHandler
        ResponseEntity handle(Exception e) {
            return new ResponseEntity(getSQLExceptionMessage(e, getClass()), new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
    }

    public static String getSQLExceptionMessage(Exception e, Class srcClass) {
        LoggerFactory.getLogger(srcClass).error(e.getClass() + ":"+e.getMessage());
        String message = e.getMessage();
        Throwable ex = e.getCause();
        if(ex == null) return message;
        ex = ex.getCause();
        if(ex == null) return message;
        if(ex instanceof SQLException) {
            message = ex.getMessage().split("\n")[0];
        }
        return message;
    }

    public static void checkEmpty(String name, HashMap<String, String> req, String[] allowedEmpty) throws Exception{
        ArrayList<String> emptyList = new ArrayList<>();
        req.forEach((key, value) -> {
            if(value.trim().isEmpty() &&
                allowedEmpty != null &&
                !Arrays.asList(allowedEmpty).contains(key)) {
                emptyList.add(key + " is empty\n");
            }
        });
        if(!emptyList.isEmpty()) {
            StringBuilder out = new StringBuilder();
            out.append(name + ":\n");
            emptyList.forEach(out::append);
//            System.out.println(out.toString());
            throw new Exception(out.toString());
        }
    }
}

