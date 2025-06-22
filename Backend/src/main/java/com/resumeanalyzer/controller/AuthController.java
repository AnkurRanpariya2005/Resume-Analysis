package com.resumeanalyzer.controller;

import com.resumeanalyzer.model.User;
import com.resumeanalyzer.security.JwtTokenProvider;
import com.resumeanalyzer.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> signUpRequest) {
        String name = signUpRequest.get("name");
        String email = signUpRequest.get("email");
        String password = signUpRequest.get("password");

        User user = userService.createUser(name, email, password);
        
        String jwt = tokenProvider.generateToken(user.getEmail());
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("user", user);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.get("email"),
                loginRequest.get("password")
            )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(loginRequest.get("email"));
        
        User user = userService.findByEmail(loginRequest.get("email"));
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("user", user);
        
        return ResponseEntity.ok(response);
    }
} 