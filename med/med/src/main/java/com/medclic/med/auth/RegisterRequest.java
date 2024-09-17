package com.medclic.med.auth;

import com.medclic.med.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class RegisterRequest {


    private String name;
    private String email;
    private String username;
    private String password;
    private Role role;
    private Date dateOfBirth;
    private String address;
    private String phone;
}
