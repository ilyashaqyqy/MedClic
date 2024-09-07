package com.medclic.med.auth;

import com.medclic.med.config.JwtService;
import com.medclic.med.exception.EmailAlreadyExistsException;
import com.medclic.med.exception.InvalidCredentialsException;
import com.medclic.med.model.Role;
import com.medclic.med.model.User;
import com.medclic.med.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        // Check if email is already registered
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("Email is already registered: " + request.getEmail());
        }

        Role userRole = Role.PATIENT; // Default to ROLE_PATIENT

        if (request.getRole() != null) {
            try {
                userRole = Role.valueOf(request.getRole().toString());
            } catch (IllegalArgumentException e) {
                // Invalid role provided, keep the default ROLE_PATIENT
                throw new IllegalArgumentException("Invalid role provided");
            }
        }

        User newUser = new User();
        newUser.setEmail(request.getEmail()); // Email as username
        newUser.setName(request.getName());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRole(userRole);
        User savedUser = userRepository.save(newUser);

        // Convert User to UserDetails if needed
        String jwtToken = jwtService.generateToken(savedUser, savedUser.getId());

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new InvalidCredentialsException("Invalid username or password");
        }

        User user = loadUserByUsername(request.getEmail());
        String jwtToken = jwtService.generateToken(user, user.getId());

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .userId(user.getId())
                .build();
    }

    private User loadUserByUsername(String username) {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}
