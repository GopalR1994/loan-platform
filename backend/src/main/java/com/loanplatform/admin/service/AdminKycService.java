package com.loanplatform.admin.service;

import com.loanplatform.kyc.entity.CustomerKyc;
import com.loanplatform.kyc.repository.CustomerKycRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminKycService {

    private final CustomerKycRepository customerKycRepository;

    public AdminKycService(CustomerKycRepository customerKycRepository) {
        this.customerKycRepository = customerKycRepository;
    }

    public List<CustomerKyc> getAllKyc() {
        return customerKycRepository.findAllByOrderByCreatedAtDesc();
    }
}
