
package com.springboot.firstproject.service;

import java.lang.reflect.Type;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import com.springboot.firstproject.dto.ExpenseDTO;
import com.springboot.firstproject.entity.Expense;
import com.springboot.firstproject.repository.ExpenseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository er;
    private final ModelMapper mapper;

    @Override
    public void add(ExpenseDTO expenseDTO) {
        Expense expense = mapper.map(expenseDTO, Expense.class);
        if (expense.getIdExpense() != null && er.existsById(expense.getIdExpense())) {
            throw new RuntimeException("Expense already exists!");
        }
        er.save(expense);
    }

    @Override
    public void update(ExpenseDTO expenseDTO) {
        Expense expense = mapper.map(expenseDTO, Expense.class);
        if (expense.getIdExpense() == null || !er.existsById(expense.getIdExpense())) {
            throw new RuntimeException("Expense does not exist!");
        }
        er.save(expense);
    }

    @Override
    public void delete(Long id) {
        er.deleteById(id);
    }

    @Override
    public List<ExpenseDTO> getAll() {
        Type listType = new TypeToken<List<ExpenseDTO>>(){}.getType();
        return mapper.map((List<Expense>) er.findAll(), listType);
    }

    @Override
    public ExpenseDTO getById(Long id) {
        Expense expense = er.findById(id).orElseThrow(() -> new RuntimeException("Expense not found"));
        return mapper.map(expense, ExpenseDTO.class);
    }
}