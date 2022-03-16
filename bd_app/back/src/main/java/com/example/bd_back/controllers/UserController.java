package com.example.bd_back.controllers;

import com.example.bd_back.configuration.CustomUser;
import com.example.bd_back.entities.UserEntity;
import com.example.bd_back.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
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
        if(userService.checkEmployeeExists(req)) {
            System.out.println("employee already registered: " + req.getUsername());
            return new ResponseEntity<>("Employee already registered.", HttpStatus.CONFLICT);
        } else if(userService.checkUsernameExists(req)) {
            System.out.println("username already registered: " + req.getUsername());
            return new ResponseEntity<>("Username already registered.", HttpStatus.CONFLICT);
        } else {
            UserEntity user = userService.save(req);
            System.out.println("user registered: " + user.getEmployee() + " " + user.getUsername());
            return new ResponseEntity<>(user, HttpStatus.CREATED);
        }
    }

    @GetMapping("/api/login")
    public ResponseEntity<?> login(Principal principal) {
//        Set<String> roles = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
//                .map(r -> r.getAuthority()).collect(Collectors.toSet());
//        Map<String, Set<String>> rolesMap = new HashMap<>();
//        rolesMap.put("roles", roles);

        CustomUser user = (CustomUser)SecurityContextHolder.getContext().getAuthentication().getPrincipal();

//        rolesMap.put("principal", principal);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
}
