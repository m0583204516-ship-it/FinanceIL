package com.springboot.firstproject.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class IncomeDTO {
    private Long idIncome;
    private double amount;
    private String source;
    private String description;
    private LocalDateTime incomeDate;
    private UserDTO owner;
}
