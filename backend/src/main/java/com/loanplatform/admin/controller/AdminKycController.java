package com.loanplatform.admin.controller;

import com.loanplatform.admin.service.AdminKycService;
import com.loanplatform.kyc.entity.CustomerKyc;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/kyc")
public class AdminKycController {

    private final AdminKycService adminKycService;

    public AdminKycController(AdminKycService adminKycService) {
        this.adminKycService = adminKycService;
    }

    @GetMapping
    public List<CustomerKyc> getAllKyc() {
        return adminKycService.getAllKyc();
    }
}
