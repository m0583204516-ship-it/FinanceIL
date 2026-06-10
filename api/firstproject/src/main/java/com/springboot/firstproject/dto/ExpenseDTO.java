package com.springboot.firstproject.dto;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ExpenseDTO {
    private Long idExpense;
    private double amount;
    private String category;
    private String description;
    private LocalDateTime expenseDate;
    @JsonProperty("isCanceled")
    private boolean isCanceled;
    @JsonProperty("isFutureExpense")
    private boolean isFutureExpense;
    private UserDTO owner;
}
