package com.loanplatform.kyc.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateKycRequest(

        @NotBlank(message = "KYC type is required")
        @Size(max = 50, message = "KYC type cannot exceed 50 characters")
        String kycType,

        @Size(max = 100, message = "ID number cannot exceed 100 characters")
        String idNumber,

        @Size(max = 500, message = "ID document URL cannot exceed 500 characters")
        String idDocumentUrl,

        @Size(max = 500, message = "Selfie URL cannot exceed 500 characters")
        String selfieUrl
) {
}
