package com.loanplatform.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record OtpRequest(

        @NotBlank(message = "Mobile number is required")
        @Size(max = 20, message = "Mobile number cannot exceed 20 characters")
        @Pattern(
                regexp = "^[0-9+]+$",
                message = "Invalid mobile number"
        )
        String mobileNumber
) {
}
