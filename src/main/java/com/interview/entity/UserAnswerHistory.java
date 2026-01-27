package com.interview.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("UserAnswerHistory")
public class UserAnswerHistory {
    @TableId(value = "HistoryId", type = IdType.AUTO)
    private Integer historyId;

    private Integer userId;

    private Integer questionId;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime viewedAt;

    private Integer viewCount;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime lastViewedAt;
}