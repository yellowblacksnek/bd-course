package com.example.bd_back.entities;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "employees")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_id", nullable = false)
    private Integer id;

    @OneToOne(optional = false)
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @Column(name = "employment_date", nullable = false)
    private LocalDate employmentDate;

    @Column(name = "acc_lvl", nullable = false)
    private String accLvl;

    @ManyToMany
    @JoinTable(name = "employee_positions",
            joinColumns = @JoinColumn(name = "employee_id"),
            inverseJoinColumns = @JoinColumn(name = "position_id"))
    private Set<Position> positions = new LinkedHashSet<>();

    @ManyToMany(mappedBy = "employees")
    private Set<VisaCheck> visaChecks = new LinkedHashSet<>();

    public Set<VisaCheck> getVisaChecks() {
        return visaChecks;
    }

    public void setVisaChecks(Set<VisaCheck> visaChecks) {
        this.visaChecks = visaChecks;
    }

    public Set<Position> getPositions() {
        return positions;
    }

    public void setPositions(Set<Position> positions) {
        this.positions = positions;
    }

    public String getAccLvl() {
        return accLvl;
    }

    public void setAccLvl(String accLvl) {
        this.accLvl = accLvl;
    }

    public LocalDate getEmploymentDate() {
        return employmentDate;
    }

    public void setEmploymentDate(LocalDate employmentDate) {
        this.employmentDate = employmentDate;
    }

    public Person getPerson() {
        return person;
    }

    public void setPerson(Long Person) {
        this.person = person;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}