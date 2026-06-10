
package com.springboot.firstproject.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.firstproject.dto.AccountDTO;
import com.springboot.firstproject.dto.LoginRequestDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.springboot.firstproject.service.AccountService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService as;
    @GetMapping("/getAll")
    public ResponseEntity<List<AccountDTO>> getAll() {
        return ResponseEntity.ok(as.getAll());
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody AccountDTO a) {
        as.add(a);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody AccountDTO a) {
        as.update(a);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        as.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            AccountDTO dto = as.getById(id);
            return ResponseEntity.ok(dto);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account not found");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AccountDTO> login(@RequestBody LoginRequestDTO req) {
        try {
            AccountDTO dto = as.loginByEmail(req.getEmail(), req.getPassword());
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
