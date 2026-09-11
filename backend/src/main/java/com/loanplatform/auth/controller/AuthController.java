package com.loanplatform.auth.controller;

import com.loanplatform.auth.dto.AuthResponse;
import com.loanplatform.auth.dto.OtpRequest;
import com.loanplatform.auth.dto.OtpResponse;
import com.loanplatform.auth.dto.OtpVerifyRequest;
import com.loanplatform.auth.service.OtpService;
import com.loanplatform.customer.repository.CustomerRepository;
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
    private final CustomerRepository customerRepository;

    public AuthController(
            OtpService otpService,
            OtpProperties otpProperties,
            JwtService jwtService,
            JwtProperties jwtProperties,
            CustomerRepository customerRepository) {

        this.otpService = otpService;
        this.otpProperties = otpProperties;
        this.jwtService = jwtService;
        this.jwtProperties = jwtProperties;
        this.customerRepository = customerRepository;
    }

    /*
     * Customer Login
     *
     * Existing customers can request OTP.
     * Unregistered mobile numbers are rejected.
     */
    @PostMapping("/otp/request")
    public ResponseEntity<OtpResponse> requestOtp(
            @Valid @RequestBody OtpRequest request) {

        if (!customerRepository.existsByMobileNumber(
                request.mobileNumber())) {

            throw new IllegalArgumentException(
                    "Mobile number is not registered. Please use Create Account."
            );
        }

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

    /*
     * Customer Registration
     *
     * Existing customers cannot register again.
     * New mobile numbers can request registration OTP.
     */
    @PostMapping("/otp/register")
    public ResponseEntity<OtpResponse> registerOtp(
            @Valid @RequestBody OtpRequest request) {

        if (customerRepository.existsByMobileNumber(
                request.mobileNumber())) {

            throw new IllegalArgumentException(
                    "Mobile number is already registered. Please use Customer Login."
            );
        }

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

    /*
     * Verify OTP
     *
     * Only registered customers can receive a login token.
     */
    @PostMapping("/otp/verify")
    public ResponseEntity<AuthResponse> verifyOtp(
            @Valid @RequestBody OtpVerifyRequest request) {

        if (!customerRepository.existsByMobileNumber(
                request.mobileNumber())) {

            throw new IllegalArgumentException(
                    "Mobile number is not registered. Please use Create Account."
            );
        }

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