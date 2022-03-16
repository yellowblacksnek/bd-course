package com.example.bd_back.entities;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "people")
public class Person {

    public static enum Dimensions {alpha, prime};
    public static enum PersonStates {alive, dead, unknown};

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "person_id", nullable = false)
    private Long id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "birth_date")
    private LocalDate birthDate;

//    @ManyToOne(fetch = FetchType.LAZY)
    @Column(name = "counterpart")
    private Long counterpart;

    @Column(name = "birth_dim", nullable = false)
    @Enumerated(EnumType.STRING)
    private Dimensions birthDim;

    @Column(name = "current_dim")
    @Enumerated(EnumType.STRING)
    private Dimensions currentDim;

    @Column(name = "knows")
    private Boolean knows;

    @Column(name = "restrict_until")
    private LocalDate restrictUntil;

    @Column(name = "person_state", nullable = false)
    @Enumerated(EnumType.STRING)
    private PersonStates personState;

    @Column(name = "death_date")
    private LocalDate deathDate;

    @Override
    public String toString() {
        return "Person{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", birthDate=" + birthDate +
                ", counterpart=" + counterpart +
                ", birthDim='" + birthDim + '\'' +
                ", currentDim='" + currentDim + '\'' +
                ", knows=" + knows +
                ", restrictUntil=" + restrictUntil +
                ", personState='" + personState + '\'' +
                ", deathDate=" + deathDate +
                '}';
    }

    public LocalDate getDeathDate() {
        return deathDate;
    }

    public void setDeathDate(LocalDate deathDate) {
        this.deathDate = deathDate;
    }

    public PersonStates getPersonState() {
        return personState;
    }

    public void setPersonState(PersonStates personState) {
        this.personState = personState;
    }

    public LocalDate getRestrictUntil() {
        return restrictUntil;
    }

    public void setRestrictUntil(LocalDate restrictUntil) {
        this.restrictUntil = restrictUntil;
    }

    public Boolean getKnows() {
        return knows;
    }

    public void setKnows(Boolean knows) {
        this.knows = knows;
    }

    public Dimensions getCurrentDim() {
        return currentDim;
    }

    public void setCurrentDim(Dimensions currentDim) {
        this.currentDim = currentDim;
    }

    public Dimensions getBirthDim() {
        return birthDim;
    }

    public void setBirthDim(Dimensions birthDim) {
        this.birthDim = birthDim;
    }

    public Long getCounterpart() {
        return counterpart;
    }

    public void setCounterpart(Long counterpart) {
        this.counterpart = counterpart;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public Long getId() {
        return id;
    }

}