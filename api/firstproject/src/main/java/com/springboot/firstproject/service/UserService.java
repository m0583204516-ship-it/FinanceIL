package com.springboot.firstproject.service;

import java.util.List;
import com.springboot.firstproject.dto.UserDTO;

public interface UserService {
    void add(UserDTO user);
    void update(UserDTO user);
    void delete(String id);
    List<UserDTO> getAll();
    UserDTO getById(String id);
}