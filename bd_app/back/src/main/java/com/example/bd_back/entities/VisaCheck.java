package com.example.bd_back.entities;

import javax.persistence.*;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "visa_checks")
public class VisaCheck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "visa_check_id", nullable = false)
    private Integer id;

    @Basic(fetch = FetchType.LAZY)
    @Column(name = "visa_app_id", nullable = false)
    private Integer visaApp;

    @Column(name = "comment")
    private String comment;

    @Column(name = "is_finished", nullable = false)
    private Boolean isFinished = false;

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

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Integer getVisaApp() {
        return visaApp;
    }

    public void setVisaApp(Integer visaApp) {
        this.visaApp = visaApp;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}