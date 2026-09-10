package com.loanplatform.customer.dto;

import com.loanplatform.customer.entity.Customer;

import java.time.OffsetDateTime;
import java.util.UUID;

public record CustomerResponse(
        UUID id,
        String mobileNumber,
        String firstName,
        String lastName,
        String email,
        String status,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {

    public static CustomerResponse from(Customer customer) {
        return new CustomerResponse(
                customer.getId(),
                customer.getMobileNumber(),
                customer.getFirstName(),
                customer.getLastName(),
                customer.getEmail(),
                customer.getStatus(),
                customer.getCreatedAt(),
                customer.getUpdatedAt()
        );
    }
}
