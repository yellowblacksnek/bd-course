package com.example.bd_back.entities;

import javax.persistence.*;

@Entity
@Table(name = "positions")
public class Position {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "position_id", nullable = false)
    private Integer id;

    @Column(name = "department", nullable = false)
    private String department;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "acc_lvl", nullable = false)
    private String accLvl;

    public String getAccLvl() {
        return accLvl;
    }

    public void setAccLvl(String accLvl) {
        this.accLvl = accLvl;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

}