package com.springboot.firstproject.service;
import java.util.List;
import com.springboot.firstproject.dto.ExpenseDTO;

public interface ExpenseService {
    void add(ExpenseDTO e);
    void update(ExpenseDTO e);
    void delete(Long id);
    List<ExpenseDTO> getAll();
    ExpenseDTO getById(Long id);
}
