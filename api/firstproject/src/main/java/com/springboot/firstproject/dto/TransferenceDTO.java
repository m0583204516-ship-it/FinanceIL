package com.springboot.firstproject.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class TransferenceDTO {
    private Long idTransference;
    private double amount;
    private LocalDateTime date;
    private AccountDTO fromAccount;
    private AccountDTO toAccount;
}
