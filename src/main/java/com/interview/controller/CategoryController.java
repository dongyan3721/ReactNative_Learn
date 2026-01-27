package com.interview.controller;

import com.interview.common.Result;
import com.interview.dto.request.SwitchCategoryRequest;
import com.interview.entity.JobCategory;
import com.interview.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public Result<List<JobCategory>> getAllCategories() {
        List<JobCategory> categories = categoryService.getAllCategories();
        return Result.success(categories);
    }

    @GetMapping("/current")
    public Result<JobCategory> getCurrentCategory() {
        JobCategory category = categoryService.getCurrentCategory();
        return Result.success(category);
    }

    @PostMapping("/switch")
    public Result<String> switchCategory(@Valid @RequestBody SwitchCategoryRequest request) {
        categoryService.switchCategory(request.getCategoryId());
        return Result.success("切换成功");
    }
}