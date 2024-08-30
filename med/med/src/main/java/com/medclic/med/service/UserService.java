package com.medclic.med.service;

import com.medclic.med.dto.UserDTO;

import java.util.List;

public interface UserService {
    UserDTO getUserById(Long userId);
    UserDTO createUser(UserDTO userDTO);
    UserDTO updateUser(UserDTO userDTO);
    void deleteUser(Long userId);
    List<UserDTO> getAllUsers();
}

