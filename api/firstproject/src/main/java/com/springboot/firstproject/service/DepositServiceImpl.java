
package com.springboot.firstproject.service;

import java.lang.reflect.Type;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import com.springboot.firstproject.dto.DepositDTO;
import com.springboot.firstproject.entity.Deposit;
import com.springboot.firstproject.repository.DepositRepository;
import com.springboot.firstproject.repository.AccountRepository;
import com.springboot.firstproject.entity.Account;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DepositServiceImpl implements DepositService {

    private final DepositRepository dr;
    private final ModelMapper mapper;
    private final AccountRepository ar;

    @Override
    public void add(DepositDTO depositDTO) {
        Deposit deposit = mapper.map(depositDTO, Deposit.class);
        if (deposit.getStartDate() == null || deposit.getEndDate() == null) {
            throw new IllegalArgumentException("Start date and end date are required");
        }
        if (!deposit.getStartDate().isBefore(deposit.getEndDate())) {
            throw new IllegalArgumentException("Start date must be before end date");
        }
        if (deposit.getIdDeposit() != null && dr.existsById(deposit.getIdDeposit())) {
            throw new RuntimeException("Deposit already exists!");
        }
        dr.save(deposit);
    }

    @Override
    public void update(DepositDTO depositDTO) {
        Deposit deposit = mapper.map(depositDTO, Deposit.class);
        if (deposit.getIdDeposit() == null || !dr.existsById(deposit.getIdDeposit())) {
            throw new RuntimeException("Deposit does not exist!");
        }
        dr.save(deposit);
    }

    @Override
    public void delete(Long id) {
        dr.deleteById(id);
    }

    @Override
    public List<DepositDTO> getAll() {
        Type listType = new TypeToken<List<DepositDTO>>(){}.getType();
        return mapper.map((List<Deposit>) dr.findAll(), listType);
    }

    @Override
    public DepositDTO getById(Long id) {
        Deposit deposit = dr.findById(id).orElseThrow(() -> new RuntimeException("Deposit not found"));
        return mapper.map(deposit, DepositDTO.class);
    }

    @Override
    public void releaseMaturedDeposits() {
        LocalDate today = LocalDate.now();
        java.util.List<Deposit> matured = dr.findByEndDateLessThanEqualAndIsReleasedFalse(today);
        for (Deposit dep : matured) {                       
                double annualRate = 0.025;               
                long days = ChronoUnit.DAYS.between(dep.getStartDate(), dep.getEndDate());
                double interest = dep.getAmount() * annualRate * (days / 365.0);

                String ownerId = dep.getOwner().getIdUser();
                Account account = ar.findByUserIdUser(ownerId).orElseThrow(() -> new RuntimeException("Owner account not found"));

                double newBalance = account.getBalance() + dep.getAmount() + interest;
                account.setBalance(newBalance);
                ar.save(account);

                dep.setReleased(true);
                dr.save(dep);         
        }
    }
}