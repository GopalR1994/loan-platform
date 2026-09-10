package com.loanplatform.admin.controller;

import com.loanplatform.admin.service.AdminCustomerService;
import com.loanplatform.customer.entity.Customer;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/customers")
public class AdminCustomerController {

    private final AdminCustomerService adminCustomerService;

    public AdminCustomerController(
            AdminCustomerService adminCustomerService) {

        this.adminCustomerService = adminCustomerService;
    }

    @GetMapping
    public List<Customer> getAllCustomers() {
        return adminCustomerService.getAllCustomers();
    }
}
