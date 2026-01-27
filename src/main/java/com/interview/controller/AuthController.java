package com.interview.controller;

import com.interview.common.Result;
import com.interview.dto.request.LoginRequest;
import com.interview.dto.request.RegisterRequest;
import com.interview.dto.response.LoginResponse;
import com.interview.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public Result<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        LoginResponse response = authService.register(request);
        return Result.success(response);
    }

    @PostMapping("/login")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return Result.success(response);
    }
}