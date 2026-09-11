package com.loanplatform.kyc.repository;

import com.loanplatform.kyc.entity.CustomerKyc;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CustomerKycRepository extends JpaRepository<CustomerKyc, UUID> {

    Optional<CustomerKyc> findByCustomerId(UUID customerId);

    boolean existsByCustomerId(UUID customerId);
}
