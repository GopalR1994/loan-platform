package com.loanplatform.auth.service;

import com.loanplatform.security.OtpProperties;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {

    private static final String OTP_KEY_PREFIX = "auth:otp:";

    private final StringRedisTemplate redisTemplate;
    private final OtpProperties otpProperties;
    private final SecureRandom secureRandom = new SecureRandom();

    public OtpService(
            StringRedisTemplate redisTemplate,
            OtpProperties otpProperties) {

        this.redisTemplate = redisTemplate;
        this.otpProperties = otpProperties;
    }

    public String generateAndStoreOtp(String mobileNumber) {

        String otp = generateOtp();

        String key = OTP_KEY_PREFIX + mobileNumber;

        redisTemplate.opsForValue().set(
                key,
                otp,
                otpProperties.expirationSeconds(),
                TimeUnit.SECONDS
        );

        return otp;
    }

    public boolean verifyOtp(String mobileNumber, String otp) {

        String key = OTP_KEY_PREFIX + mobileNumber;

        String storedOtp = redisTemplate.opsForValue().get(key);

        if (storedOtp == null) {
            return false;
        }

        if (!storedOtp.equals(otp)) {
            return false;
        }

        redisTemplate.delete(key);

        return true;
    }

    private String generateOtp() {

        int length = otpProperties.length();

        int min = (int) Math.pow(10, length - 1);
        int max = (int) Math.pow(10, length);

        int otpNumber =
                secureRandom.nextInt(max - min) + min;

        return String.valueOf(otpNumber);
    }
}
