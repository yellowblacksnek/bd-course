package com.example.bd_back.services;

import com.example.bd_back.configuration.CustomUser;
import com.example.bd_back.entities.Employee;
import com.example.bd_back.entities.Position;
import com.example.bd_back.entities.UserEntity;
import com.example.bd_back.repositories.EmployeesRepository;
import com.example.bd_back.repositories.UserEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
//    @Autowired
    private UserEntityRepository userRepo;
    private EmployeesRepository emplRepo;

    @Autowired
    UserDetailsServiceImpl(UserEntityRepository userRepo, EmployeesRepository emplRepo) {
        this.userRepo = userRepo;
        this.emplRepo = emplRepo;
    }

    @Override
//    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) {
//        System.out.println("looking for user with username: " + username);
        Optional<UserEntity> userEntityResult = userRepo.findById(username);
        if (!userEntityResult.isPresent()) throw new UsernameNotFoundException(username);
        UserEntity user = userEntityResult.get();

        List<GrantedAuthority> grantedAuthorities = buildUserAuthority(user);
        grantedAuthorities.add(new SimpleGrantedAuthority("user"));

        CustomUser userDetails = new CustomUser(user.getUsername(), user.getPassword(), grantedAuthorities);
        userDetails.setEmployeeId(user.getEmployee());
        return userDetails;
    }

    private List<GrantedAuthority> buildUserAuthority(UserEntity user) {

        Set<GrantedAuthority> setAuths = new HashSet<>();
        Employee employee = emplRepo.findById(user.getEmployee()).get();
        List<Position> positions = emplRepo.getPositions(user.getEmployee());

        setAuths.add(new SimpleGrantedAuthority("user"));

//        if(user.getUsername().equals("user")) {
//            String[] all = {"interface", "decryption", "analysis", "strategy", "operations", "customs"};
//            setAuths.addAll(Arrays.stream(all).map(SimpleGrantedAuthority::new).collect(Collectors.toList()));
//        } else {
        for (Position pos : positions) {
            setAuths.add(new SimpleGrantedAuthority(pos.getDepartment()));
            setAuths.add(new SimpleGrantedAuthority(employee.getAccLvl()));
        }
//        }
//        for(GrantedAuthority a : setAuths) {
//            System.out.println(a);
//        }
//        System.out.println(positions.size());

        return new ArrayList<>(setAuths);
    }
}