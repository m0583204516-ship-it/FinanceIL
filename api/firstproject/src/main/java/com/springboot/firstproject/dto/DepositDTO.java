package com.springboot.firstproject.dto;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class DepositDTO {
    private Long idDeposit;
    private double amount;
    private String depositType;
    private LocalDate startDate;
    private LocalDate endDate;
    @JsonProperty("isReleased")
    private boolean isReleased;
    private UserDTO owner;
}
