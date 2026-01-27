package com.interview.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("Positions")
public class Position {
    @TableId(value = "PositionId", type = IdType.AUTO)
    private Integer positionId;

    private Integer categoryId;

    private String positionName;

    private String positionCode;

    private String description;

    private Integer sortOrder;

    private Boolean isActive;
}