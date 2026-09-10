package com.loanplatform.admin.service;

import com.loanplatform.admin.dto.AdminLoginRequest;
import com.loanplatform.admin.dto.AdminLoginResponse;
import com.loanplatform.security.JwtProperties;
import com.loanplatform.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminAuthService {

    private final JwtService jwtService;
    private final JwtProperties jwtProperties;
    private final PasswordEncoder passwordEncoder;

    public AdminAuthService(
            JwtService jwtService,
            JwtProperties jwtProperties,
            PasswordEncoder passwordEncoder) {

        this.jwtService = jwtService;
        this.jwtProperties = jwtProperties;
        this.passwordEncoder = passwordEncoder;
    }

    public AdminLoginResponse login(
            AdminLoginRequest request) {

        String configuredUsername =
        System.getenv().getOrDefault("ADMIN_USERNAME", "admin");

        String configuredPassword = System.getenv("ADMIN_PASSWORD");

        if (configuredPassword == null || configuredPassword.isBlank()) {
        throw new IllegalStateException("ADMIN_PASSWORD environment variable is not configured");
        }

        String configuredPasswordHash =
                passwordEncoder.encode(configuredPassword);

        if (!configuredUsername.equals(request.username())
                || !passwordEncoder.matches(
                        request.password(),
                        configuredPasswordHash)) {

            throw new IllegalArgumentException(
                    "Invalid admin username or password"
            );
        }

        String accessToken = jwtService.generateToken(
                request.username(),
                "ADMIN"
        );

        return new AdminLoginResponse(
                accessToken,
                "Bearer",
                jwtProperties.expirationSeconds()
        );
    }
}
