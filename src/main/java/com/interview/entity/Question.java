package com.interview.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@TableName("Questions")
public class Question {
    @TableId(value = "QuestionId", type = IdType.AUTO)
    private Integer questionId;

    private Integer topicId;

    private String title;

    private String contentMd;

    private String answerMd;

    private String difficulty;

    private Integer sortOrder;

    private Integer createdBy;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    private Boolean isActive;

    private Boolean isPremium;

    private Integer viewCount;

    @TableField(exist = false)
    private List<Tag> tags;

    @TableField(exist = false)
    private Boolean isFavorited;
}