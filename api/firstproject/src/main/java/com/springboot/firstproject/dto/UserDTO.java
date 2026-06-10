package com.springboot.firstproject.dto;
import lombok.Data;

@Data
public class UserDTO {
    private String idUser;    
    private String firstName; 
    private String lastName; 
    private String email;
    private String phone;
}
