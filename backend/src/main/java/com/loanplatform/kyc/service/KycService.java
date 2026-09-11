package com.loanplatform.kyc.service;

import com.loanplatform.kyc.entity.CustomerKyc;
import com.loanplatform.kyc.repository.CustomerKycRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class KycService {

    private final CustomerKycRepository customerKycRepository;

    public KycService(CustomerKycRepository customerKycRepository) {
        this.customerKycRepository = customerKycRepository;
    }

    public CustomerKyc createKyc(
            UUID customerId,
            String kycType,
            String idNumber,
            String idDocumentUrl,
            String selfieUrl) {

        if (customerKycRepository.existsByCustomerId(customerId)) {
            throw new IllegalArgumentException(
                    "KYC already exists for this customer"
            );
        }

        CustomerKyc kyc = new CustomerKyc();

        kyc.setCustomerId(customerId);
        kyc.setKycType(kycType);
        kyc.setIdNumber(idNumber);
        kyc.setIdDocumentUrl(idDocumentUrl);
        kyc.setSelfieUrl(selfieUrl);
        kyc.setStatus("PENDING");

        return customerKycRepository.save(kyc);
    }

    public CustomerKyc getKycByCustomerId(UUID customerId) {

        return customerKycRepository.findByCustomerId(customerId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "KYC not found for customer"
                        ));
    }
}
