package com.springboot.firstproject.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ControllerAdvice {
    @ExceptionHandler(Exception.class)
     public ResponseEntity<String> func(Exception e)
    {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Oops...... We are sorry, there is a problem");
    }   
}
