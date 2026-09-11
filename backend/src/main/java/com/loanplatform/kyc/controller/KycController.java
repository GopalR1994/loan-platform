package com.loanplatform.kyc.controller;

import com.loanplatform.customer.entity.Customer;
import com.loanplatform.customer.repository.CustomerRepository;
import com.loanplatform.kyc.dto.CreateKycRequest;
import com.loanplatform.kyc.dto.KycResponse;
import com.loanplatform.kyc.entity.CustomerKyc;
import com.loanplatform.kyc.service.KycService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/kyc")
public class KycController {

    private final KycService kycService;
    private final CustomerRepository customerRepository;

    public KycController(
            KycService kycService,
            CustomerRepository customerRepository) {
        this.kycService = kycService;
        this.customerRepository = customerRepository;
    }

    @PostMapping
    public ResponseEntity<KycResponse> createKyc(
            Authentication authentication,
            @Valid @RequestBody CreateKycRequest request) {

        UUID customerId = getAuthenticatedCustomerId(authentication);

        CustomerKyc kyc = kycService.createKyc(
                customerId,
                request.kycType(),
                request.idNumber(),
                request.idDocumentUrl(),
                request.selfieUrl()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toResponse(kyc));
    }

    @GetMapping
    public ResponseEntity<KycResponse> getKyc(
            Authentication authentication) {

        UUID customerId = getAuthenticatedCustomerId(authentication);

        return ResponseEntity.ok(
                toResponse(kycService.getKycByCustomerId(customerId))
        );
    }

    private UUID getAuthenticatedCustomerId(
            Authentication authentication) {

        String mobileNumber = authentication.getName();

        Customer customer = customerRepository
                .findByMobileNumber(mobileNumber)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Customer not found"
                        ));

        return customer.getId();
    }

    private KycResponse toResponse(CustomerKyc kyc) {
        return new KycResponse(
                kyc.getId(),
                kyc.getCustomerId(),
                kyc.getKycType(),
                kyc.getIdNumber(),
                kyc.getIdDocumentUrl(),
                kyc.getSelfieUrl(),
                kyc.getStatus(),
                kyc.getRejectionReason(),
                kyc.getVerifiedAt(),
                kyc.getCreatedAt(),
                kyc.getUpdatedAt()
        );
    }
}
