package com.loanplatform.admin.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard(
            Authentication authentication) {

        return Map.of(
                "message", "Welcome to Admin Dashboard",
                "username", authentication.getName(),
                "role", "ADMIN"
        );
    }
}
