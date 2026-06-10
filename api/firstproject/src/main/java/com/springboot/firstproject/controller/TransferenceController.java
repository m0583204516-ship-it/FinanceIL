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

import com.springboot.firstproject.dto.TransferenceDTO;
import com.springboot.firstproject.service.TransferenceService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/transferences")
@RequiredArgsConstructor
public class TransferenceController {
    private final TransferenceService ts;

    @GetMapping("/getAll")
    public ResponseEntity<List<TransferenceDTO>> getAll() {
        return ResponseEntity.ok(ts.getAll());
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody TransferenceDTO t) {
        ts.add(t);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody TransferenceDTO t) {
        ts.update(t);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        ts.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            TransferenceDTO dto = ts.getById(id);
            return ResponseEntity.ok(dto);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Transference not found");
        }
    }
}
