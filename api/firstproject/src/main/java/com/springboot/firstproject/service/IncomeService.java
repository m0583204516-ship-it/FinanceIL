package com.springboot.firstproject.service;
import java.util.List;
import com.springboot.firstproject.dto.IncomeDTO;

public interface IncomeService {
    void add(IncomeDTO i);
    void update(IncomeDTO i);
    void delete(Long id);
    List<IncomeDTO> getAll();
    IncomeDTO getById(Long id);
    List<IncomeDTO> getByUserId(String userId);
}
