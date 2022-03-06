package com.example.bd_back.entities;

import javax.persistence.*;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "msg_id", nullable = false)
    private Integer id;

    @Column(name = "dec_empl")
    private Integer decEmpl;

    @Column(name = "sender")
    private Long sender;

    @Column(name = "recipient")
    private Long recipient;

    @Column(name = "content")
    private String content;

    @Column(name = "enc_content")
    private String encContent;

    @Column(name = "creation_time")
    private Instant creationTime;

    @Column(name = "msg_type", nullable = false)
    private String msgType;

    @Column(name = "msg_state", nullable = false)
    private String msgState;

    @OneToMany(mappedBy = "outMsg")
    private Set<MsgExchange> msgExchanges = new LinkedHashSet<>();

    public Set<MsgExchange> getMsgExchanges() {
        return msgExchanges;
    }

    public void setMsgExchanges(Set<MsgExchange> msgExchanges) {
        this.msgExchanges = msgExchanges;
    }

    public String getMsgState() {
        return msgState;
    }

    public void setMsgState(String msgState) {
        this.msgState = msgState;
    }

    public String getMsgType() {
        return msgType;
    }

    public void setMsgType(String msgType) {
        this.msgType = msgType;
    }

    public Instant getCreationTime() {
        return creationTime;
    }

    public void setCreationTime(Instant creationTime) {
        this.creationTime = creationTime;
    }

    public String getEncContent() {
        return encContent;
    }

    public void setEncContent(String encContent) {
        this.encContent = encContent;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getRecipient() {
        return recipient;
    }

    public void setRecipient(Long recipient) {
        this.recipient = recipient;
    }

    public Long getSender() {
        return sender;
    }

    public void setSender(Long sender) {
        this.sender = sender;
    }

    public Integer getDecEmpl() {
        return decEmpl;
    }

    public void setDecEmpl(Integer decEmpl) {
        this.decEmpl = decEmpl;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}