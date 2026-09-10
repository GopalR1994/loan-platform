package com.loanplatform.admin.service;

import com.loanplatform.customer.entity.Customer;
import com.loanplatform.customer.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminCustomerService {

    private final CustomerRepository customerRepository;

    public AdminCustomerService(
            CustomerRepository customerRepository) {

        this.customerRepository = customerRepository;
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
}
