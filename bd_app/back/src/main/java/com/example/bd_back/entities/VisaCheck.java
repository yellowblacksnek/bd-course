package com.example.bd_back.entities;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "visa_checks")
public class VisaCheck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "visa_check_id", nullable = false)
    private Integer id;

    @OneToOne(optional = false)
    @JoinColumn(name = "visa_app_id", nullable = false)
    private VisaApplication visaApp;

    @Basic(optional = false)
    @Column(name = "visa_app_id", nullable = false, updatable = false, insertable = false)
    private Long visaAppId;

    @Column(name = "verdict_comment")
    private String comment;

    @Column(name = "is_finished", nullable = false)
    private Boolean isFinished = false;

    @Column(name = "verdict")
    @Enumerated(EnumType.STRING)
    private VisaApplication.VisaVerdicts verdict;

    @Column(name = "verdict_date")
    private LocalDate verdictDate;

    @ManyToMany
    @JoinTable(name = "visa_check_employees",
            joinColumns = @JoinColumn(name = "visa_check_id"),
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


    public LocalDate getVerdictDate() {
        return verdictDate;
    }

    public void setVerdictDate(LocalDate verdictDate) {
        this.verdictDate = verdictDate;
    }

    public VisaApplication.VisaVerdicts getVerdict() {
        return verdict;
    }

    public void setVerdict(VisaApplication.VisaVerdicts verdict) {
        this.verdict = verdict;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Integer getVisaAppId() {
        return visaApp.getId();
    }
    public VisaApplication getVisaApp() {
        return visaApp;
    }

    public void setVisaApp(VisaApplication visaApp) {
        this.visaApp = visaApp;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}