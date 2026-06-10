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

import com.springboot.firstproject.dto.UserDTO;
import com.springboot.firstproject.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService us;
    @GetMapping("/getAll")
    public ResponseEntity<List<UserDTO>> getAll() {
        return ResponseEntity.ok(us.getAll());
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody UserDTO u) {
        us.add(u);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody UserDTO u) {
        us.update(u);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        us.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<?> getByCode(@PathVariable String id) {
        try {
            UserDTO dto = us.getById(id);
            return ResponseEntity.ok(dto);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }
}
