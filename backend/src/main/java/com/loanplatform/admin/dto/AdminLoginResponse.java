package com.loanplatform.admin.dto;

public record AdminLoginResponse(
        String accessToken,
        String tokenType,
        long expiresInSeconds
) {}
