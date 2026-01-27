package com.interview.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("JobCategories")
public class JobCategory {
    @TableId(value = "CategoryId", type = IdType.AUTO)
    private Integer categoryId;

    private String categoryName;

    private String categoryCode;

    private String description;

    private String iconUrl;

    private Integer sortOrder;

    private Boolean isActive;
}
