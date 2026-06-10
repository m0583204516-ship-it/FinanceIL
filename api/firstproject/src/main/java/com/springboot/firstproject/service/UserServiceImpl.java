package com.springboot.firstproject.service;

import java.lang.reflect.Type;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import com.springboot.firstproject.dto.UserDTO;
import com.springboot.firstproject.entity.User;
import com.springboot.firstproject.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper mapper;

    @Override
    public void add(UserDTO userDTO) {
        User user = mapper.map(userDTO, User.class);
        if (user.getIdUser() != null && userRepository.existsById(user.getIdUser())) {
            throw new RuntimeException("User already exists!");
        }
        userRepository.save(user);
    }

    @Override
    public void update(UserDTO userDTO) {
        User user = mapper.map(userDTO, User.class);
        if (user.getIdUser() == null || !userRepository.existsById(user.getIdUser())) {
            throw new RuntimeException("User does not exist!");
        }
        userRepository.save(user);
    }

    @Override
    public void delete(String id) {
        userRepository.deleteById(id);
    }

    @Override
    public List<UserDTO> getAll() {
        Type listType = new TypeToken<List<UserDTO>>(){}.getType();
        return mapper.map((List<User>) userRepository.findAll(), listType);
    }

    @Override
    public UserDTO getById(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return mapper.map(user, UserDTO.class);
    }
}