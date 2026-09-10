package com.loanplatform.admin.controller;

import com.loanplatform.admin.dto.AdminLoginRequest;
import com.loanplatform.admin.dto.AdminLoginResponse;
import com.loanplatform.admin.service.AdminAuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/auth")
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    public AdminAuthController(
            AdminAuthService adminAuthService) {

        this.adminAuthService = adminAuthService;
    }

    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponse> login(
            @Valid @RequestBody AdminLoginRequest request) {

        return ResponseEntity.ok(
                adminAuthService.login(request)
        );
    }
}
