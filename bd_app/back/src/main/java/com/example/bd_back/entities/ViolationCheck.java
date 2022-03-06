package com.example.bd_back.entities;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "violation_checks")
public class ViolationCheck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "violation_check_id", nullable = false)
    private Integer id;

    @Basic(fetch = FetchType.LAZY)
    @Column(name = "violation_id", nullable = false)
    private Integer violation;

    @Column(name = "verdict")
    private String verdict;

    @Column(name = "restrict_until")
    private LocalDate restrictUntil;

    @Column(name = "verdict_date")
    private LocalDate verdictDate;

    @Lob
    @Column(name = "comment")
    private String comment;

    @Column(name = "is_finished", nullable = false)
    private Boolean isFinished = false;

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

    public String getVerdict() {
        return verdict;
    }

    public void setVerdict(String verdict) {
        this.verdict = verdict;
    }

    public Integer getViolation() {
        return violation;
    }

    public void setViolation(Integer violation) {
        this.violation = violation;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}