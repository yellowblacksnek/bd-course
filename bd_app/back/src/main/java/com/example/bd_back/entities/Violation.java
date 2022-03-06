package com.example.bd_back.entities;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "violations")
public class Violation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "violation_id", nullable = false)
    private Integer id;

    @Basic(fetch = FetchType.LAZY)
    @Column(name = "person_id", nullable = false)
    private Long person;

    @Basic(fetch = FetchType.LAZY)
    @Column(name = "violation_type", nullable = false)
    private Integer violationType;

    @Column(name = "description")
    private String description;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "is_closed", nullable = false)
    private Boolean isClosed = false;

    public Boolean getIsClosed() {
        return isClosed;
    }

    public void setIsClosed(Boolean isClosed) {
        this.isClosed = isClosed;
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

    public Long getPerson() {
        return person;
    }

    public void setPerson(Long person) {
        this.person = person;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}