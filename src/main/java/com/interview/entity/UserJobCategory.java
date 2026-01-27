package com.interview.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("UserJobCategories")
public class UserJobCategory {
    @TableId(value = "UserCategoryId", type = IdType.AUTO)
    private Integer userCategoryId;

    private Integer userId;

    private Integer categoryId;

    private Boolean isCurrentSelection;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime selectedAt;

    @TableField(exist = false)
    private JobCategory category;
}