package com.loanplatform.kyc.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record KycResponse(
        UUID id,
        UUID customerId,
        String kycType,
        String idNumber,
        String idDocumentUrl,
        String selfieUrl,
        String status,
        String rejectionReason,
        OffsetDateTime verifiedAt,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}
