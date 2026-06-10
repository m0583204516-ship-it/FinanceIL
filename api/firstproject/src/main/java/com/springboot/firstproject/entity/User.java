package com.springboot.firstproject.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data 
@Entity
@Table(name = "users_")
public class User {
    @Id
    @Column
    private String idUser; 

    @Column(nullable = false)
    private String firstName; 
    
     @Column(nullable = false)
    private String lastName; 

    @Column(unique = true,nullable = false)
    private String email;
    
    @Column
    private String phone; 
}


