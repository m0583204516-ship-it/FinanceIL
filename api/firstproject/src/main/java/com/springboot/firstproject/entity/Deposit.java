package com.springboot.firstproject.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data 
@Entity
@Table(name = "deposits")
public class Deposit {
    @Id 
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long idDeposit;
    
    @Column(nullable = false)
    private double amount; 
    
    private String depositType; 

    private LocalDate startDate;
    
    private LocalDate endDate;

    @JsonProperty("isReleased")
    private boolean isReleased;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner; 
}
