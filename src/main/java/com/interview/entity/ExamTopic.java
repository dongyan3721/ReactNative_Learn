package com.interview.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("ExamTopics")
public class ExamTopic {
    @TableId(value = "TopicId", type = IdType.AUTO)
    private Integer topicId;

    private Integer positionId;

    private String topicName;

    private String topicCode;

    private String description;

    private Integer sortOrder;

    private Boolean isActive;

    @TableField(exist = false)
    private Integer questionCount;
}