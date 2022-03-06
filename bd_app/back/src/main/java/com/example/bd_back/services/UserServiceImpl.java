package com.example.bd_back.services;

import com.example.bd_back.entities.UserEntity;
import com.example.bd_back.repositories.UserEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private UserEntityRepository userRepository;
    private PasswordEncoder passwordEncoder;

    @Autowired
    UserServiceImpl(UserEntityRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserEntity save(UserEntity user) {
        Optional<UserEntity> existing = userRepository.findById(user.getUsername());
        if(existing.isPresent()) return null;
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public boolean saveIfNotExists(UserEntity user) {
        return save(user) != null;
    }

    @Override
    public boolean validate(UserEntity user) {
        if(user.getPassword() == null ||
                user.getPassword().length() < 4 ||
                user.getUsername() == null ||
                user.getUsername().length() < 4 ||
                user.getEmployee() == null)
            return false;
        else return true;
    }
}
