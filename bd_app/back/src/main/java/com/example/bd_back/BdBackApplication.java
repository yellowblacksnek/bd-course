package com.example.bd_back;

import com.example.bd_back.entities.Person;
import com.example.bd_back.repositories.PeopleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
public class BdBackApplication {

    private static final Logger log = LoggerFactory.getLogger(BdBackApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(BdBackApplication.class, args);
    }

//    @Override
//    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
//        config.exposeIdsFor(Book.class);
//    }

//    @Bean
//    public CommandLineRunner demo(PeopleRepository repo) {
//        return (args) -> {
//
//            // fetch an individual customer by ID
//            Person person = repo.findById(60499L);
//            log.info("Person found with findById(1L):");
//            log.info("--------------------------------");
//            log.info(person.toString());
//            log.info("");
//        };
//    }

}
