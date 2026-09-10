package com.loanplatform;

import com.loanplatform.security.JwtProperties;
import com.loanplatform.security.OtpProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({
        JwtProperties.class,
        OtpProperties.class
})
public class LoanPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(LoanPlatformApplication.class, args);
    }
}
