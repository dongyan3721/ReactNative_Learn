package com.interview.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("QuestionTags")
public class QuestionTag {
    @TableId(value = "QuestionTagId", type = IdType.AUTO)
    private Integer questionTagId;

    private Integer questionId;

    private Integer tagId;
}