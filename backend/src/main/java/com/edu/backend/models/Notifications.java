package com.edu.backend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Notifications {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String message;
    private Long senderid;
    private String sender;
    private Long recieverid;
    private Long pid;
    private Long cid;
    private boolean seen;
    public Notifications() {
    }

    public Notifications(Long id, String message, Long senderid, String sender, Long recieverid, Long pid, Long cid,boolean seen) {
        this.id = id;
        this.message = message;
        this.senderid = senderid;
        this.sender = sender;
        this.recieverid = recieverid;
        this.pid = pid;
        this.cid = cid;
        this.seen = seen;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPid() {
        return pid;
    }

    public void setPid(Long pid) {
        this.pid = pid;
    }

    public Long getCid() {
        return cid;
    }

    public void setCid(Long cid) {
        this.cid = cid;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getSenderid() {
        return senderid;
    }

    public void setSenderid(Long senderid) {
        this.senderid = senderid;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public Long getRecieverid() {
        return recieverid;
    }

    public void setRecieverid(Long recieverid) {
        this.recieverid = recieverid;
    }

    public boolean isSeen() {
        return seen;
    }

    public void setSeen(boolean seen) {
        this.seen = seen;
    }
}
