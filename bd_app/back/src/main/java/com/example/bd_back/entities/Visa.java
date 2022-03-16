package com.example.bd_back.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "visas")
public class Visa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "visa_id", nullable = false)
    private Integer id;

    @Basic(fetch = FetchType.LAZY)
    @Column(name = "person_id", nullable = false)
    private Long person;

    @Basic(fetch = FetchType.LAZY)
    @Column(name = "issue_empl_id")
    private Integer issueEmpl;

    @Column(name = "issue_date")
    private LocalDate issueDate;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "exp_date", nullable = false)
    private LocalDate expDate;

    @Column(name = "visa_state", nullable = false)
    private String visaState;

    @Column(name = "max_trans", nullable = false)
    private Integer maxTrans;

    @Column(name = "cur_trans", nullable = false)
    private Integer curTrans;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "visa_application", nullable = false)
    private VisaApplication visaApplication;

    public VisaApplication getVisaApplication() {
        return visaApplication;
    }

    public void setVisaApplication(VisaApplication visaApplication) {
        this.visaApplication = visaApplication;
    }

    public Integer getCurTrans() {
        return curTrans;
    }

    public void setCurTrans(Integer curTrans) {
        this.curTrans = curTrans;
    }

    public Integer getMaxTrans() {
        return maxTrans;
    }

    public void setMaxTrans(Integer maxTrans) {
        this.maxTrans = maxTrans;
    }

    public String getVisaState() {
        return visaState;
    }

    public void setVisaState(String visaState) {
        this.visaState = visaState;
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

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }

    public Integer getIssueEmpl() {
        return issueEmpl;
    }

    public void setIssueEmpl(Integer issueEmpl) {
        this.issueEmpl = issueEmpl;
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