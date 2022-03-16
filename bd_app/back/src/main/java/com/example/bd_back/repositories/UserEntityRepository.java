package com.example.bd_back.repositories;

import com.example.bd_back.entities.UserEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserEntityRepository extends CrudRepository<UserEntity, String> {
    Optional<UserEntity> findByEmployee(Integer employee);
}