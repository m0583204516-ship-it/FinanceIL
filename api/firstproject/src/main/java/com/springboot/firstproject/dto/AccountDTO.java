package com.springboot.firstproject.dto;
import lombok.Data;

@Data
public class AccountDTO { 
    private Long idAccount;
    private double balance;
    private UserDTO user;    
    private String type;
    private String rool;
}

    