package com.loanplatform.admin.controller;

import com.loanplatform.admin.dto.RejectKycRequest;
import com.loanplatform.admin.service.AdminKycService;
import com.loanplatform.kyc.entity.CustomerKyc;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

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

    @PutMapping("/{kycId}/approve")
    public CustomerKyc approveKyc(@PathVariable UUID kycId) {
        return adminKycService.approveKyc(kycId);
    }

    @PutMapping("/{kycId}/reject")
    public CustomerKyc rejectKyc(
            @PathVariable UUID kycId,
            @Valid @RequestBody RejectKycRequest request) {

        return adminKycService.rejectKyc(
                kycId,
                request.rejectionReason()
        );
    }
}
