package com.loanplatform.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.otp")
public record OtpProperties(
        int length,
        long expirationSeconds
) {
}
