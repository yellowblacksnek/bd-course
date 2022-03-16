package com.example.bd_back.entities;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "violation_checks")
public class ViolationCheck {
    public static enum ViolationVerdicts {restriction, warning, no_action}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "violation_check_id", nullable = false)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "violation_id", nullable = false)
    private Violation violation;

    @Basic(optional = false)
    @Column(name = "violation_id", nullable = false, updatable = false, insertable = false)
    private Long violationId;

    @Column(name = "verdict")
    @Enumerated(EnumType.STRING)
    private ViolationVerdicts verdict;

    @Column(name = "restrict_until")
    private LocalDate restrictUntil;

    @Column(name = "verdict_date")
    private LocalDate verdictDate;

    @Column(name = "verdict_comment")
    private String comment;

    @Column(name = "is_finished", nullable = false)
    private Boolean isFinished = false;

    @ManyToMany
    @JoinTable(name = "violation_check_employees",
            joinColumns = @JoinColumn(name = "violation_check_id"),
            inverseJoinColumns = @JoinColumn(name = "employee_id"))
    private Set<Employee> employees = new LinkedHashSet<>();

    public Set<Employee> getEmployees() {
        return employees;
    }

    public void setEmployees(Set<Employee> employees) {
        this.employees = employees;
    }

    public Boolean getIsFinished() {
        return isFinished;
    }

    public void setIsFinished(Boolean isFinished) {
        this.isFinished = isFinished;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDate getVerdictDate() {
        return verdictDate;
    }

    public void setVerdictDate(LocalDate verdictDate) {
        this.verdictDate = verdictDate;
    }

    public LocalDate getRestrictUntil() {
        return restrictUntil;
    }

    public void setRestrictUntil(LocalDate restrictUntil) {
        this.restrictUntil = restrictUntil;
    }

    public ViolationVerdicts getVerdict() {
        return verdict;
    }

    public void setVerdict(ViolationVerdicts verdict) {
        this.verdict = verdict;
    }

    public Integer getViolationId() {
        return violation.getId();
    }
    public Violation getViolation() {
        return violation;
    }

    public void setViolation(Violation violation) {
        this.violation = violation;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}