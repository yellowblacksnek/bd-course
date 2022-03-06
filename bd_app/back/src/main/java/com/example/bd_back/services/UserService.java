package com.example.bd_back.services;

import com.example.bd_back.entities.UserEntity;

import java.util.Optional;

public interface UserService {
    // save(User user);
    boolean validate(UserEntity user);
    boolean saveIfNotExists(UserEntity user);
}