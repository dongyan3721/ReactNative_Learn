package com.interview.common;

import com.interview.exception.BusinessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    public static Integer getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Integer) {
            return (Integer) authentication.getPrincipal();
        }
        throw new BusinessException(ResultCode.UNAUTHORIZED);
    }
}