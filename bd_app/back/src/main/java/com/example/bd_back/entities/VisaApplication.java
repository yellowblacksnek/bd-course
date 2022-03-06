package com.example.bd_back.entities;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "visa_applications")
public class VisaApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "visa_app_id", nullable = false)
    private Integer id;

    @Column(name = "person_id", nullable = false)
    private Long person;

    @Column(name = "application_date", nullable = false)
    private LocalDate applicationDate;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "exp_date", nullable = false)
    private LocalDate expDate;

    @Column(name = "trans", nullable = false)
    private Integer trans;

    @Column(name = "visa_app_state", nullable = false)
    private String visaAppState;

    @Column(name = "verdict")
    private String verdict;

    @Column(name = "verdict_date")
    private LocalDate verdictDate;

    public LocalDate getVerdictDate() {
        return verdictDate;
    }

    public void setVerdictDate(LocalDate verdictDate) {
        this.verdictDate = verdictDate;
    }

    public String getVerdict() {
        return verdict;
    }

    public void setVerdict(String verdict) {
        this.verdict = verdict;
    }

    public String getVisaAppState() {
        return visaAppState;
    }

    public void setVisaAppState(String visaAppState) {
        this.visaAppState = visaAppState;
    }

    public Integer getTrans() {
        return trans;
    }

    public void setTrans(Integer trans) {
        this.trans = trans;
    }

    public LocalDate getExpDate() {
        return expDate;
    }

    public void setExpDate(LocalDate expDate) {
        this.expDate = expDate;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(LocalDate applicationDate) {
        this.applicationDate = applicationDate;
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