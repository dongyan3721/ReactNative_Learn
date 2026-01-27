package com.interview.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("Users")
public class User {
    @TableId(value = "UserId", type = IdType.AUTO)
    private Integer userId;

    private String email;

    private String passwordHash;

    private String username;

    private String avatar;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    private LocalDateTime lastLoginAt;

    private Boolean isActive;

    private Boolean isPremium;

    private LocalDateTime premiumExpireAt;
}