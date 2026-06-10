package com.springboot.firstproject.entity;

import java.time.LocalDateTime;

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
@Table(name = "expenses")
public class Expense {
    @Id 
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long idExpense;
    
    @Column(nullable = false)
    private double amount; 
    
    private String category; 
    
    private String description;

    private LocalDateTime expenseDate;

    @JsonProperty("isCanceled")
    private boolean isCanceled;
    
    @JsonProperty("isFutureExpense")
    private boolean isFutureExpense;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner; 
}
