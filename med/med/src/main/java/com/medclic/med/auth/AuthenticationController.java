package com.medclic.med.auth;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/register/doctor") // New endpoint for doctor registration
    public ResponseEntity<AuthenticationResponse> registerDoctor(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

//    @GetMapping("/test")
//    public ResponseEntity<String> testEndpoint() {
//        return ResponseEntity.ok("Test endpoint working");
//    }

}

