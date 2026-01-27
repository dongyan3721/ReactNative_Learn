package com.interview.config;

import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import org.springframework.stereotype.Component;

/**
 * PascalCase (大驼峰) 命名策略
 * Java: userId -> SQL: UserId
 */
@Component
public class PascalCaseNamingStrategy {

    /**
     * 将 camelCase 转换为 PascalCase
     * userId -> UserId
     * categoryName -> CategoryName
     */
    public static String toPascalCase(String camelCase) {
        if (StringUtils.isBlank(camelCase)) {
            return camelCase;
        }
        // 首字母大写
        return camelCase.substring(0, 1).toUpperCase() + camelCase.substring(1);
    }
}