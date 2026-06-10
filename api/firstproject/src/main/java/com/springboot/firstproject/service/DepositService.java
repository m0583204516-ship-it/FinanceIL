package com.springboot.firstproject.service;
import java.util.List;
import com.springboot.firstproject.dto.DepositDTO;

public interface DepositService {
    void add(DepositDTO d);
    void update(DepositDTO d);
    void delete(Long id);
    List<DepositDTO> getAll();
    DepositDTO getById(Long id);
    void releaseMaturedDeposits();
}
