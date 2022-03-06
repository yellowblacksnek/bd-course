package com.example.bd_back.entities;

import org.hibernate.Hibernate;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Entity;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class PersonRelationId implements Serializable {
    private static final long serialVersionUID = 4397741145094713195L;
    @Column(name = "rel_subject", nullable = false)
    private Long relSubject;
    @Column(name = "rel_object", nullable = false)
    private Long relObject;

    public Long getRelObject() {
        return relObject;
    }

    public void setRelObject(Long relObject) {
        this.relObject = relObject;
    }

    public Long getRelSubject() {
        return relSubject;
    }

    public void setRelSubject(Long relSubject) {
        this.relSubject = relSubject;
    }

    @Override
    public int hashCode() {
        return Objects.hash(relSubject, relObject);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        PersonRelationId entity = (PersonRelationId) o;
        return Objects.equals(this.relSubject, entity.relSubject) &&
                Objects.equals(this.relObject, entity.relObject);
    }
}