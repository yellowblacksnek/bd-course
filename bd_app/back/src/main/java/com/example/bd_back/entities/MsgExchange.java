package com.example.bd_back.entities;

import javax.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "msg_exchanges")
public class MsgExchange {

    public static enum MsgExStates {scheduled, ok, fail}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "msg_exc_id", nullable = false)
    private Integer id;

    @Basic(fetch = FetchType.LAZY)
    @Column(name = "out_msg")
    private Integer outMsg;

    @Column(name = "room", nullable = false)
    private Integer room;

    @Column(name = "exc_time", nullable = false)
    private Instant excTime;

    @Basic(fetch = FetchType.LAZY)
    @Column(name = "employee_id", nullable = false)
    private Integer employee;

    @Basic(fetch = FetchType.LAZY)
    @Column(name = "in_msg")
    private Integer inMsg;

    @Column(name = "msg_ex_state", nullable = false)
    @Enumerated(EnumType.STRING)
    private MsgExStates msgExState;

    public MsgExStates getMsgExState() {
        return msgExState;
    }

    public void setMsgExState(MsgExStates msgExState) {
        this.msgExState = msgExState;
    }

    public Integer getInMsg() {
        return inMsg;
    }

    public void setInMsg(Integer inMsg) {
        this.inMsg = inMsg;
    }

    public Integer getEmployee() {
        return employee;
    }

    public void setEmployee(Integer employee) {
        this.employee = employee;
    }

    public Instant getExcTime() {
        return excTime;
    }

    public void setExcTime(Instant excTime) {
        this.excTime = excTime;
    }

    public Integer getRoom() {
        return room;
    }

    public void setRoom(Integer room) {
        this.room = room;
    }

    public Integer getOutMsg() {
        return outMsg;
    }

    public void setOutMsg(Integer outMsg) {
        this.outMsg = outMsg;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

}