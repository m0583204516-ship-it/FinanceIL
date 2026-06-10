
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

import com.springboot.firstproject.dto.ExpenseDTO;
import com.springboot.firstproject.service.ExpenseService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/expenses")
@RequiredArgsConstructor
public class ExpenseController {
    private final ExpenseService es;
    @GetMapping("/getAll")
    public ResponseEntity<List<ExpenseDTO>> getAll() {
        return ResponseEntity.ok(es.getAll());
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody ExpenseDTO e) {
        es.add(e);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody ExpenseDTO e) {
        es.update(e);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        es.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            ExpenseDTO dto = es.getById(id);
            return ResponseEntity.ok(dto);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Expense not found");
        }
    }
}
