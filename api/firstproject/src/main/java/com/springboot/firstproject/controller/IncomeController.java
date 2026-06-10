
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

import com.springboot.firstproject.dto.IncomeDTO;
import com.springboot.firstproject.service.IncomeService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/incomes")
@RequiredArgsConstructor
public class IncomeController {
    private final IncomeService is;
    @GetMapping("/getAll")
    public ResponseEntity<List<IncomeDTO>> getAll() {
        return ResponseEntity.ok(is.getAll());
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody IncomeDTO i) {
        is.add(i);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody IncomeDTO i) {
        is.update(i);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        is.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            IncomeDTO dto = is.getById(id);
            return ResponseEntity.ok(dto);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Income not found");
        }
    }

    @GetMapping("/getByUser/{userId}")
    public ResponseEntity<List<IncomeDTO>> getByUser(@PathVariable String userId) {
        return ResponseEntity.ok(is.getByUserId(userId));
    }

}
