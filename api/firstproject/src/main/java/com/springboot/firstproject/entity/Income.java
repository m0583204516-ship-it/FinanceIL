package com.springboot.firstproject.entity;

import java.time.LocalDateTime;

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
@Table(name = "incomes")
public class Income {//הכנסה
    @Id 
    //@GeneratedValue
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long idIncome;
   
    @Column(nullable = false)
    private double amount; 
    
    private String source; //סוג ההכנסה
    
    private String description;

    private LocalDateTime incomeDate; 

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;
}
