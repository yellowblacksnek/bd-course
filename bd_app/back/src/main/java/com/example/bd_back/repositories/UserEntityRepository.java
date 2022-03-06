package com.example.bd_back.repositories;

import com.example.bd_back.entities.UserEntity;
import org.springframework.data.repository.CrudRepository;

public interface UserEntityRepository extends CrudRepository<UserEntity, String> {
}