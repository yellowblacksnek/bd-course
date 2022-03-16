package com.example.bd_back.entities;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "violations")
public class Violation {
    public static enum ViolationStates {awaits_review, reviewing, done}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "violation_id", nullable = false)
    private Integer id;

    @OneToOne(optional = false)
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @Basic(fetch = FetchType.LAZY)
    @Column(name = "violation_type", nullable = false)
    private Integer violationType;

    @Column(name = "description")
    private String description;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "violation_state", nullable = false)
    @Enumerated(EnumType.STRING)
    private ViolationStates violationState;

    public Long getPersonId() {return this.person.getId();}

    public ViolationStates getViolationState() {
        return violationState;
    }

    public void setViolationState(ViolationStates violationState) {
        this.violationState = violationState;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getViolationType() {
        return violationType;
    }

    public void setViolationType(Integer violationType) {
        this.violationType = violationType;
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
}