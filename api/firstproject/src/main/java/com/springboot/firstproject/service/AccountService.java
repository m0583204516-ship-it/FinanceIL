package com.springboot.firstproject.service;
import java.util.List;
import com.springboot.firstproject.dto.AccountDTO;

public interface AccountService {
    void add(AccountDTO a);
    void update(AccountDTO a);
    void delete(Long id);
    List<AccountDTO> getAll();
    AccountDTO getById(Long id);
    AccountDTO loginByEmail(String email, String password);
}
