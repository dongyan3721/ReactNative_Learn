package com.interview.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("UserFavorites")
public class UserFavorite {
    @TableId(value = "FavoriteId", type = IdType.AUTO)
    private Integer favoriteId;

    private Integer userId;

    private Integer questionId;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime favoritedAt;
}