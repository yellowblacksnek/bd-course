package com.example.bd_back.entities;

import javax.persistence.*;

@Entity
@Table(name = "person_relations")
public class PersonRelation {
    @EmbeddedId
    private PersonRelationId id;

    @MapsId("relSubject")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "rel_subject", nullable = false)
    private Person relSubject;

    @MapsId("relObject")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "rel_object", nullable = false)
    private Person relObject;

    @Column(name = "rel_type", nullable = false)
    private String relType;

    @Column(name = "rel_description")
    private String relDescription;

    public String getRelDescription() {
        return relDescription;
    }

    public void setRelDescription(String relDescription) {
        this.relDescription = relDescription;
    }

    public String getRelType() {
        return relType;
    }

    public void setRelType(String relType) {
        this.relType = relType;
    }

    public Person getRelObject() {
        return relObject;
    }

    public void setRelObject(Person relObject) {
        this.relObject = relObject;
    }

    public Person getRelSubject() {
        return relSubject;
    }

    public void setRelSubject(Person relSubject) {
        this.relSubject = relSubject;
    }

    public PersonRelationId getId() {
        return id;
    }

    public void setId(PersonRelationId id) {
        this.id = id;
    }
}