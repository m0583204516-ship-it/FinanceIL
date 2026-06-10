
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

import com.springboot.firstproject.dto.DepositDTO;
import com.springboot.firstproject.service.DepositService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/deposits")
@RequiredArgsConstructor
public class DepositController {
    private final DepositService ds;
    @GetMapping("/getAll")
    public ResponseEntity<List<DepositDTO>> getAll() {
        return ResponseEntity.ok(ds.getAll());
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody DepositDTO d) {
        ds.add(d);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody DepositDTO d) {
        ds.update(d);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        ds.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            DepositDTO dto = ds.getById(id);
            return ResponseEntity.ok(dto);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Deposit not found");
        }
    }

    @PostMapping("/releaseMatured")
    public ResponseEntity<?> releaseMatured() {
        ds.releaseMaturedDeposits();
        return ResponseEntity.ok().body("Release process completed");
    }
}
