
package com.springboot.firstproject.service;

import java.lang.reflect.Type;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import com.springboot.firstproject.dto.IncomeDTO;
import com.springboot.firstproject.entity.Income;
import com.springboot.firstproject.repository.IncomeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IncomeServiceImpl implements IncomeService {

    private final IncomeRepository ir;
    private final ModelMapper mapper;

    @Override
    public void add(IncomeDTO incomeDTO) {
        Income income = mapper.map(incomeDTO, Income.class);
        if (income.getIdIncome() != null && ir.existsById(income.getIdIncome())) {
            throw new RuntimeException("Income already exists!");
        }
        ir.save(income);
    }

    @Override
    public void update(IncomeDTO incomeDTO) {
        Income income = mapper.map(incomeDTO, Income.class);
        if (income.getIdIncome() == null || !ir.existsById(income.getIdIncome())) {
            throw new RuntimeException("Income does not exist!");
        }
        ir.save(income);
    }

    @Override
    public void delete(Long id) {
        ir.deleteById(id);
    }

    @Override
    public List<IncomeDTO> getAll() {
        Type listType = new TypeToken<List<IncomeDTO>>(){}.getType();
        return mapper.map((List<Income>) ir.findAll(), listType);
    }

    @Override
    public IncomeDTO getById(Long id) {
        Income income = ir.findById(id).orElseThrow(() -> new RuntimeException("Income not found"));
        return mapper.map(income, IncomeDTO.class);
    }

    @Override
    public List<IncomeDTO> getByUserId(String userId) {
        Type listType = new TypeToken<List<IncomeDTO>>(){}.getType();
        return mapper.map((List<Income>) ir.findByOwnerIdUser(userId), listType);
    }
}