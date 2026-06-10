package com.springboot.firstproject.service;

import java.lang.reflect.Type;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import com.springboot.firstproject.dto.AccountDTO;
import com.springboot.firstproject.entity.Account;
import com.springboot.firstproject.repository.AccountRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository ar;
    private final ModelMapper mapper;

    @Override
    public void add(AccountDTO accountDTO) {
        Account account = mapper.map(accountDTO, Account.class);
        if (account.getIdAccount() != null && ar.existsById(account.getIdAccount())) {
            throw new RuntimeException("Account already exists!");
        }
        ar.save(account);
    }

    @Override
    public void update(AccountDTO accountDTO) {
        Account account = mapper.map(accountDTO, Account.class);
        if (account.getIdAccount() == null || !ar.existsById(account.getIdAccount())) {
            throw new RuntimeException("Account does not exist!");
        }
        ar.save(account);
    }

    @Override
    public void delete(Long id) {
        ar.deleteById(id);
    }

    @Override
    public List<AccountDTO> getAll() {
        Type listType = new TypeToken<List<AccountDTO>>(){}.getType();
        return mapper.map((List<Account>) ar.findAll(), listType);
    }

    @Override
    public AccountDTO getById(Long id) {
        Account account = ar.findById(id).orElseThrow(() -> new RuntimeException("Account not found"));
        return mapper.map(account, AccountDTO.class);
    }

    @Override
    public AccountDTO loginByEmail(String email, String password) {
        Account account = ar.findByUserEmail(email).orElseThrow(() -> new RuntimeException("Account not found"));
        if (!account.getPassword().equals(password)) {
            throw new RuntimeException("Invalid credentials");
        }
        return mapper.map(account, AccountDTO.class);
    }
}