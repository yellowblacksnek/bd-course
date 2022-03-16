package com.example.bd_back.services;

import com.example.bd_back.entities.UserEntity;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface UserService {
    // save(User user);
    boolean validate(UserEntity user);
    UserEntity save(UserEntity user);
    boolean checkEmployeeExists(UserEntity user);
    boolean checkUsernameExists(UserEntity user);
}