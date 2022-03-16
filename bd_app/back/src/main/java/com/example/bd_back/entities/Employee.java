package com.example.bd_back.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

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

    @Basic(optional = false)
    @Column(name = "person_id", nullable = false, updatable = false, insertable = false)
    private Long personId;

    @Column(name = "employment_date", nullable = false)
    private LocalDate employmentDate;

    @Column(name = "acc_lvl", nullable = false)
    private String accLvl;

    @ManyToMany
    @JoinTable(name = "employee_positions",
            joinColumns = @JoinColumn(name = "employee_id"),
            inverseJoinColumns = @JoinColumn(name = "position_id"))
    private Set<Position> positions = new LinkedHashSet<>();

    @JsonIgnore
    @ManyToMany(mappedBy = "employees", fetch = FetchType.LAZY)
    private Set<VisaCheck> visaChecks = new LinkedHashSet<>();

    @JsonIgnore
    @ManyToMany(mappedBy = "employees", fetch = FetchType.LAZY)
    private Set<ViolationCheck> violationChecks = new LinkedHashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY)
    private Set<MsgExchange> msgExchanges = new LinkedHashSet<>();

    public Set<MsgExchange> getMsgExchanges() {
        return msgExchanges;
    }

    public void setMsgExchanges(Set<MsgExchange> msgExchanges) {
        this.msgExchanges = msgExchanges;
    }

    public Person getPerson() {
        return person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Long getPersonId() {return this.personId;}
    public void setPersonId(Long personId) { this.personId = personId;}

    public LocalDate getEmploymentDate() {
        return employmentDate;
    }

    public void setEmploymentDate(LocalDate employmentDate) {
        this.employmentDate = employmentDate;
    }

    public String getAccLvl() {
        return accLvl;
    }

    public void setAccLvl(String accLvl) {
        this.accLvl = accLvl;
    }

    public Set<Position> getPositions() {
        return positions;
    }

    public void setPositions(Set<Position> positions) {
        this.positions = positions;
    }

    public Set<ViolationCheck> getViolationChecks() {
        return violationChecks;
    }

    public void setViolationChecks(Set<ViolationCheck> violationChecks) {
        this.violationChecks = violationChecks;
    }

    public Set<VisaCheck> getVisaChecks() {
        return visaChecks;
    }

    public void setVisaChecks(Set<VisaCheck> visaChecks) {
        this.visaChecks = visaChecks;
    }

//    public Person.Dimensions getPersonDim() { return this.person.getBirthDim(); }
//    public void setPersonDim() { this.personDim = this.person.getBirthDim(); }


}