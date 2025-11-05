package com.data.backend.controller;

import com.data.backend.dto.ResponseWrapper;
import com.data.backend.dto.req.*;
import com.data.backend.dto.resp.AuthResponse;
import com.data.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ResponseWrapper<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            ResponseWrapper<AuthResponse> wrapper = ResponseWrapper.<AuthResponse>builder()
                    .status(HttpStatus.CREATED)
                    .code(HttpStatus.CREATED.value())
                    .data(response)
                    .message("Registration successful")
                    .build();
            return ResponseEntity.status(HttpStatus.CREATED).body(wrapper);
        } catch (Exception e) {
            ResponseWrapper<AuthResponse> wrapper = ResponseWrapper.<AuthResponse>builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .code(HttpStatus.BAD_REQUEST.value())
                    .data(null)
                    .message(e.getMessage())
                    .build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(wrapper);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseWrapper<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            ResponseWrapper<AuthResponse> wrapper = ResponseWrapper.<AuthResponse>builder()
                    .status(HttpStatus.OK)
                    .code(HttpStatus.OK.value())
                    .data(response)
                    .message("Login successful")
                    .build();
            return ResponseEntity.ok(wrapper);
        } catch (Exception e) {
            ResponseWrapper<AuthResponse> wrapper = ResponseWrapper.<AuthResponse>builder()
                    .status(HttpStatus.UNAUTHORIZED)
                    .code(HttpStatus.UNAUTHORIZED.value())
                    .data(null)
                    .message(e.getMessage())
                    .build();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(wrapper);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ResponseWrapper<String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        try {
            String message = authService.forgotPassword(request);
            ResponseWrapper<String> wrapper = ResponseWrapper.<String>builder()
                    .status(HttpStatus.OK)
                    .code(HttpStatus.OK.value())
                    .data(message)
                    .message("Password reset email sent successfully")
                    .build();
            return ResponseEntity.ok(wrapper);
        } catch (Exception e) {
            ResponseWrapper<String> wrapper = ResponseWrapper.<String>builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .code(HttpStatus.BAD_REQUEST.value())
                    .data(null)
                    .message(e.getMessage())
                    .build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(wrapper);
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ResponseWrapper<String>> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {
        try {
            String message = authService.verifyOtp(request);
            ResponseWrapper<String> wrapper = ResponseWrapper.<String>builder()
                    .status(HttpStatus.OK)
                    .code(HttpStatus.OK.value())
                    .data(message)
                    .message("OTP verified successfully")
                    .build();
            return ResponseEntity.ok(wrapper);
        } catch (Exception e) {
            ResponseWrapper<String> wrapper = ResponseWrapper.<String>builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .code(HttpStatus.BAD_REQUEST.value())
                    .data(null)
                    .message(e.getMessage())
                    .build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(wrapper);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ResponseWrapper<String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        try {
            String message = authService.resetPassword(request);
            ResponseWrapper<String> wrapper = ResponseWrapper.<String>builder()
                    .status(HttpStatus.OK)
                    .code(HttpStatus.OK.value())
                    .data(message)
                    .message("Password reset successfully")
                    .build();
            return ResponseEntity.ok(wrapper);
        } catch (Exception e) {
            ResponseWrapper<String> wrapper = ResponseWrapper.<String>builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .code(HttpStatus.BAD_REQUEST.value())
                    .data(null)
                    .message(e.getMessage())
                    .build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(wrapper);
        }
    }
}
