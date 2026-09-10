package com.loanplatform.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record OtpVerifyRequest(

        @NotBlank(message = "Mobile number is required")
        @Pattern(
                regexp = "^[0-9+]+$",
                message = "Invalid mobile number"
        )
        String mobileNumber,

        @NotBlank(message = "OTP is required")
        @Pattern(
                regexp = "^[0-9]{6}$",
                message = "OTP must be exactly 6 digits"
        )
        String otp
) {
}
