package com.example.bd_back.entities;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "visa_applications")
public class VisaApplication {
    public static enum VisaAppStates {awaits_review, reviewing, done}
    public static enum VisaVerdicts {granted, not_granted}

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
    @Enumerated(EnumType.STRING)
    private VisaAppStates visaAppState;

    @Column(name = "verdict")
    @Enumerated(EnumType.STRING)
    private VisaVerdicts verdict;

    @Column(name = "verdict_date")
    private LocalDate verdictDate;

    public LocalDate getVerdictDate() {
        return verdictDate;
    }

    public void setVerdictDate(LocalDate verdictDate) {
        this.verdictDate = verdictDate;
    }

    public VisaVerdicts getVerdict() {
        return verdict;
    }

    public void setVerdict(VisaVerdicts verdict) {
        this.verdict = verdict;
    }

    public VisaAppStates getVisaAppState() {
        return visaAppState;
    }

    public void setVisaAppState(VisaAppStates visaAppState) {
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