package com.loanplatform.auth.controller;

import com.loanplatform.auth.dto.AuthResponse;
import com.loanplatform.auth.dto.OtpRequest;
import com.loanplatform.auth.dto.OtpResponse;
import com.loanplatform.auth.dto.OtpVerifyRequest;
import com.loanplatform.auth.service.OtpService;
import com.loanplatform.security.JwtProperties;
import com.loanplatform.security.JwtService;
import com.loanplatform.security.OtpProperties;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final OtpService otpService;
    private final OtpProperties otpProperties;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;

    public AuthController(
            OtpService otpService,
            OtpProperties otpProperties,
            JwtService jwtService,
            JwtProperties jwtProperties) {

        this.otpService = otpService;
        this.otpProperties = otpProperties;
        this.jwtService = jwtService;
        this.jwtProperties = jwtProperties;
    }

    @PostMapping("/otp/request")
    public ResponseEntity<OtpResponse> requestOtp(
            @Valid @RequestBody OtpRequest request) {

        String otp = otpService.generateAndStoreOtp(
                request.mobileNumber()
        );

        return ResponseEntity.ok(
                new OtpResponse(
                        "OTP generated successfully. OTP: " + otp,
                        otpProperties.expirationSeconds()
                )
        );
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<AuthResponse> verifyOtp(
            @Valid @RequestBody OtpVerifyRequest request) {

        boolean valid = otpService.verifyOtp(
                request.mobileNumber(),
                request.otp()
        );

        if (!valid) {
            throw new IllegalArgumentException(
                    "Invalid or expired OTP"
            );
        }

        String accessToken = jwtService.generateToken(
                request.mobileNumber(),
                "CUSTOMER"
        );

        return ResponseEntity.ok(
                new AuthResponse(
                        accessToken,
                        "Bearer",
                        jwtProperties.expirationSeconds()
                )
        );
    }
}
