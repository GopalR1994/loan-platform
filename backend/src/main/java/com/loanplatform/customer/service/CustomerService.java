package com.loanplatform.customer.service;

import com.loanplatform.customer.dto.CreateCustomerRequest;
import com.loanplatform.customer.dto.CustomerResponse;
import com.loanplatform.customer.entity.Customer;
import com.loanplatform.customer.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Transactional
    public CustomerResponse createCustomer(CreateCustomerRequest request) {

        if (customerRepository.existsByMobileNumber(request.mobileNumber())) {
            throw new IllegalArgumentException(
                    "Customer already exists with mobile number: "
                            + request.mobileNumber()
            );
        }

        Customer customer = new Customer();

        customer.setMobileNumber(request.mobileNumber());
        customer.setFirstName(request.firstName());
        customer.setLastName(request.lastName());
        customer.setEmail(request.email());
        customer.setStatus("ACTIVE");

        Customer savedCustomer = customerRepository.save(customer);

        return CustomerResponse.from(savedCustomer);
    }

    @Transactional(readOnly = true)
    public CustomerResponse getCustomer(UUID customerId) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Customer not found: " + customerId
                        )
                );

        return CustomerResponse.from(customer);
    }

    @Transactional(readOnly = true)
    public CustomerResponse getCustomerByMobile(String mobileNumber) {

        Customer customer = customerRepository
                .findByMobileNumber(mobileNumber)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Customer not found with mobile number: "
                                        + mobileNumber
                        )
                );

        return CustomerResponse.from(customer);
    }
}
