package com.example.bd_back.controllers;

import com.example.bd_back.configuration.CustomUser;
import com.example.bd_back.entities.UserEntity;
import com.example.bd_back.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/api/register")
    public ResponseEntity<?> register(@RequestBody UserEntity req) {
        if(!userService.validate(req))
            return new ResponseEntity<>("Wrong syntax.", HttpStatus.BAD_REQUEST);
        if(userService.saveIfNotExists(req)) {
            System.out.println("user registered: " + req.getUsername());
            return new ResponseEntity<>("User registered.", HttpStatus.CREATED);
        } else {
            System.out.println("user exists: " + req.getUsername());
            return new ResponseEntity<>("User already exists.", HttpStatus.CONFLICT);
        }
    }

    @GetMapping("/api/login")
    public ResponseEntity<?> login(Principal principal) {
        Set<String> roles = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .map(r -> r.getAuthority()).collect(Collectors.toSet());
        Map<String, Set<String>> rolesMap = new HashMap<>();
        rolesMap.put("roles", roles);
//        rolesMap.put("principal", principal);
        return new ResponseEntity<>((CustomUser)SecurityContextHolder.getContext().getAuthentication().getPrincipal(), HttpStatus.OK);
    }
}
