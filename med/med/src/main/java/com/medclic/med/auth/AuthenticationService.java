package com.medclic.med.auth;


import com.medclic.med.repository.LocationRepository;
import com.medclic.med.config.JwtService;
import com.medclic.med.exception.EmailAlreadyExistsException;
import com.medclic.med.exception.InvalidCredentialsException;
import com.medclic.med.model.*;
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
    private final LocationRepository locationRepository;

    public AuthenticationResponse register(RegisterRequest request) {
        // Check if email is already registered
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("Email is already registered: " + request.getEmail());
        }

        // Set default role to PATIENT if the role is null
        Role userRole = request.getRole() != null ? request.getRole() : Role.PATIENT;

        User newUser;
        if (userRole == Role.PATIENT) {
            // Create a new Patient instance and populate the fields
            Patient newPatient = new Patient();
            newPatient.setDateOfBirth(request.getDateOfBirth());
            newPatient.setAddress(request.getAddress());
            newPatient.setPhoneNumber(request.getPhoneNumber());
            newUser = newPatient;
        } else if (userRole == Role.DOCTOR) {
            // Create a new Doctor instance and populate the fields
            Doctor newDoctor = new Doctor();
            newDoctor.setSpecialization(request.getSpecialization());
            newDoctor.setYearsOfExperience(request.getYearsOfExperience());
            newDoctor.setConsultationFee(request.getConsultationFee());
            newDoctor.setProfilePhoto(request.getProfilePhoto());
            newDoctor.setBio(request.getBio());
            newDoctor.setEducation(request.getEducation());
            newDoctor.setCertifications(request.getCertifications());

            // Set location by locationId or create a new one based on locationName
            if (request.getLocationId() != null) {
                Location location = locationRepository.findById(request.getLocationId())
                        .orElseThrow(() -> new RuntimeException("Location not found"));
                newDoctor.setLocation(location);
            } else if (request.getLocationName() != null) {
                // If locationId is null, create a new location using locationName
                Location newLocation = new Location();
                newLocation.setName(request.getLocationName());
                Location savedLocation = locationRepository.save(newLocation);
                newDoctor.setLocation(savedLocation);
            } else {
                throw new RuntimeException("Location information is missing");
            }

            newUser = newDoctor;
        } else {
            // Create a standard User for other roles
            newUser = new User();
        }

        newUser.setEmail(request.getEmail());
        newUser.setName(request.getName());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRole(userRole);

        User savedUser = userRepository.save(newUser);

        // Generate JWT token
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
