package com.loanplatform.customer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateCustomerRequest(

        @NotBlank(message = "Mobile number is required")
        @Size(max = 20, message = "Mobile number cannot exceed 20 characters")
        @Pattern(
                regexp = "^[0-9+]+$",
                message = "Invalid mobile number"
        )
        String mobileNumber,

        @Size(max = 100, message = "First name cannot exceed 100 characters")
        String firstName,

        @Size(max = 100, message = "Last name cannot exceed 100 characters")
        String lastName,

        @Size(max = 255, message = "Email cannot exceed 255 characters")
        String email
) {
}
