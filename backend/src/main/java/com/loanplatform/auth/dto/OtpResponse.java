package com.loanplatform.auth.dto;

public record OtpResponse(
        String message,
        long expiresInSeconds
) {
}
