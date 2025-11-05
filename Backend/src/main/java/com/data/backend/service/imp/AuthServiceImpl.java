package com.data.backend.service.imp;

import com.data.backend.dto.req.*;
import com.data.backend.dto.resp.AuthResponse;
import com.data.backend.exception.HttpBadRequest;
import com.data.backend.exception.HttpConflict;
import com.data.backend.exception.HttpForbiden;
import com.data.backend.exception.HttpNotFound;
import com.data.backend.exception.HttpUnAuthorized;
import com.data.backend.model.PasswordResetToken;
import com.data.backend.model.User;
import com.data.backend.repository.PasswordResetTokenRepository;
import com.data.backend.repository.UserRepository;
import com.data.backend.service.AuthService;
import com.data.backend.service.EmailService;
import com.data.backend.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new HttpConflict("Email already exists");
        }

        // Create new user
        User user = new User();
        // Combine firstName and lastName into name field
        String fullName = (request.getFirstName() + " " + request.getLastName()).trim();
        user.setName(fullName);
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setVerified(false);
        user.setAvatar(null);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        user = userRepository.save(user);

        // Generate token
        String token = jwtUtil.generateToken(user.getEmail());

        // Generate OTP for email verification
        String otp = String.format("%06d", new Random().nextInt(1_000_000));
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setEmail(request.getEmail());
        resetToken.setOtp(otp);
        resetToken.setPurpose("REGISTER");
        resetToken.setExpiredAt(LocalDateTime.now().plusMinutes(10));
        tokenRepository.save(resetToken);

        // Send verification email asynchronously
        sendEmailAsync(request.getEmail(), otp);

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new HttpNotFound("User not found"));

        if (!user.isVerified()) {
            throw new HttpForbiden("Account not verified. Please check your email for verification");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new HttpUnAuthorized("Invalid password");
        }

        // Generate token
        String token = jwtUtil.generateToken(user.getEmail());

        // Extract firstName and lastName from name
        String[] nameParts = user.getName() != null ? user.getName().split(" ", 2) : new String[]{"", ""};
        String firstName = nameParts.length > 0 ? nameParts[0] : "";
        String lastName = nameParts.length > 1 ? nameParts[1] : "";

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .firstName(firstName)
                .lastName(lastName)
                .build();
    }

    @Override
    @Transactional
    public String forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new HttpNotFound("Email not found"));

        String otp = String.format("%06d", new Random().nextInt(1_000_000));
        PasswordResetToken token = new PasswordResetToken();
        token.setEmail(email);
        token.setOtp(otp);
        token.setPurpose("RESET_PASSWORD");
        token.setExpiredAt(LocalDateTime.now().plusMinutes(10));
        tokenRepository.save(token);

        // Send email asynchronously
        sendResetPasswordEmailAsync(email, otp);

        return "OTP code has been sent to your email. Please check your inbox";
    }

    @Override
    @Transactional
    public String verifyOtp(VerifyOtpRequest request) {
        PasswordResetToken token = tokenRepository
                .findTopByEmailAndPurposeOrderByIdDesc(request.getEmail(), 
                        request.getPurpose() != null ? request.getPurpose() : "REGISTER")
                .orElseThrow(() -> new HttpNotFound("OTP not found. Please try again"));

        if (token.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new HttpForbiden("OTP has expired. Please request a new code");
        }

        if (!token.getOtp().equals(request.getOtp())) {
            throw new HttpConflict("Invalid OTP. Please check again");
        }

        if ("REGISTER".equals(request.getPurpose())) {
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new HttpNotFound("Email not found"));

            user.setVerified(true);
            userRepository.save(user);
            tokenRepository.deleteByEmailAndPurpose(request.getEmail(), "REGISTER");
            return "Email verification successful! You can now login";
        }

        return "OTP verified successfully";
    }

    @Override
    @Transactional
    public String resetPassword(ResetPasswordRequest request) {
        PasswordResetToken token = tokenRepository
                .findTopByEmailAndPurposeOrderByIdDesc(request.getEmail(), "RESET_PASSWORD")
                .orElseThrow(() -> new HttpNotFound("OTP not found. Please try again"));

        if (token.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new HttpConflict("OTP has expired. Please request a new code");
        }

        if (!token.getOtp().equals(request.getOtp())) {
            throw new HttpConflict("Invalid OTP. Please check again");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new HttpNotFound("Email not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        tokenRepository.deleteByEmailAndPurpose(request.getEmail(), "RESET_PASSWORD");

        return "Password reset successful! You can now login with your new password";
    }

    @Async
    protected void sendEmailAsync(String email, String otp) {
        try {
            emailService.sendSimpleMessage(
                    email,
                    "Account Verification",
                    "Your OTP code is: " + otp);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + email + ": " + e.getMessage());
        }
    }

    @Async
    protected void sendResetPasswordEmailAsync(String email, String otp) {
        try {
            emailService.sendSimpleMessage(
                    email,
                    "Password Reset OTP",
                    "Your OTP code is: " + otp);
        } catch (Exception e) {
            System.err.println("Failed to send reset password email to " + email + ": " + e.getMessage());
        }
    }
}
