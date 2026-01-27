package com.interview.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SwitchCategoryRequest {

    @NotNull(message = "工作大类ID不能为空")
    private Integer categoryId;
}