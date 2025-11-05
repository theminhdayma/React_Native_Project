package com.data.backend.service;

import com.data.backend.dto.req.*;
import com.data.backend.dto.resp.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    String forgotPassword(ForgotPasswordRequest request);
    String verifyOtp(VerifyOtpRequest request);
    String resetPassword(ResetPasswordRequest request);
}
