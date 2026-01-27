package com.interview.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("Tags")
public class Tag {
    @TableId(value = "TagId", type = IdType.AUTO)
    private Integer tagId;

    private String tagName;

    private String tagColor;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}