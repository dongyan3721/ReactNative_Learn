package com.interview.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.interview.common.ResultCode;
import com.interview.common.SecurityUtils;
import com.interview.entity.JobCategory;
import com.interview.entity.UserJobCategory;
import com.interview.exception.BusinessException;
import com.interview.mapper.JobCategoryMapper;
import com.interview.mapper.UserJobCategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final JobCategoryMapper categoryMapper;
    private final UserJobCategoryMapper userJobCategoryMapper;

    public List<JobCategory> getAllCategories() {
        LambdaQueryWrapper<JobCategory> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(JobCategory::getIsActive, true)
                .orderByAsc(JobCategory::getSortOrder);
        return categoryMapper.selectList(wrapper);
    }

    public JobCategory getCurrentCategory() {
        Integer userId = SecurityUtils.getCurrentUserId();
        UserJobCategory userCategory = userJobCategoryMapper.selectCurrentCategoryByUserId(userId);

        if (userCategory == null || userCategory.getCategory() == null) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "未找到当前工作大类");
        }

        return userCategory.getCategory();
    }

    @Transactional(rollbackFor = Exception.class)
    public void switchCategory(Integer categoryId) {
        Integer userId = SecurityUtils.getCurrentUserId();

        // 验证工作大类是否存在
        JobCategory category = categoryMapper.selectById(categoryId);
        if (category == null) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "工作大类不存在");
        }

        // 将所有旧的选择设为false
        LambdaUpdateWrapper<UserJobCategory> updateWrapper = new LambdaUpdateWrapper<>();
        updateWrapper.eq(UserJobCategory::getUserId, userId)
                .set(UserJobCategory::getIsCurrentSelection, false);
        userJobCategoryMapper.update(null, updateWrapper);

        // 查找是否已有该分类记录
        LambdaQueryWrapper<UserJobCategory> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(UserJobCategory::getUserId, userId)
                .eq(UserJobCategory::getCategoryId, categoryId);
        UserJobCategory existCategory = userJobCategoryMapper.selectOne(queryWrapper);

        if (existCategory == null) {
            // 创建新记录
            UserJobCategory newCategory = new UserJobCategory();
            newCategory.setUserId(userId);
            newCategory.setCategoryId(categoryId);
            newCategory.setIsCurrentSelection(true);
            userJobCategoryMapper.insert(newCategory);
        } else {
            // 更新现有记录
            existCategory.setIsCurrentSelection(true);
            userJobCategoryMapper.updateById(existCategory);
        }
    }
}
