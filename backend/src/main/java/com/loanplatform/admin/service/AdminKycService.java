package com.loanplatform.admin.service;

import com.loanplatform.kyc.entity.CustomerKyc;
import com.loanplatform.kyc.repository.CustomerKycRepository;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AdminKycService {

    private final CustomerKycRepository customerKycRepository;

    public AdminKycService(CustomerKycRepository customerKycRepository) {
        this.customerKycRepository = customerKycRepository;
    }

    public List<CustomerKyc> getAllKyc() {
        return customerKycRepository.findAllByOrderByCreatedAtDesc();
    }

    public CustomerKyc approveKyc(UUID kycId) {
        CustomerKyc kyc = getKyc(kycId);

        validatePending(kyc);

        kyc.setStatus("VERIFIED");
        kyc.setRejectionReason(null);
        kyc.setVerifiedAt(OffsetDateTime.now());

        return customerKycRepository.save(kyc);
    }

    public CustomerKyc rejectKyc(UUID kycId, String rejectionReason) {
        CustomerKyc kyc = getKyc(kycId);

        validatePending(kyc);

        kyc.setStatus("REJECTED");
        kyc.setRejectionReason(rejectionReason);
        kyc.setVerifiedAt(null);

        return customerKycRepository.save(kyc);
    }

    private CustomerKyc getKyc(UUID kycId) {
        return customerKycRepository.findById(kycId)
                .orElseThrow(() -> new IllegalArgumentException("KYC not found"));
    }

    private void validatePending(CustomerKyc kyc) {
        if (!"PENDING".equalsIgnoreCase(kyc.getStatus())) {
            throw new IllegalArgumentException(
                    "Only PENDING KYC can be approved or rejected"
            );
        }
    }
}
