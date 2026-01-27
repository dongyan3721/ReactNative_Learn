package com.interview.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.interview.common.ResultCode;
import com.interview.common.SecurityUtils;
import com.interview.entity.Position;
import com.interview.entity.UserJobCategory;
import com.interview.exception.BusinessException;
import com.interview.mapper.PositionMapper;
import com.interview.mapper.UserJobCategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PositionService {

    private final PositionMapper positionMapper;
    private final UserJobCategoryMapper userJobCategoryMapper;

    public List<Position> getPositionsByCategory(Integer categoryId) {
        LambdaQueryWrapper<Position> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Position::getCategoryId, categoryId)
                .eq(Position::getIsActive, true)
                .orderByAsc(Position::getSortOrder);
        return positionMapper.selectList(wrapper);
    }

    public List<Position> getCurrentUserPositions() {
        Integer userId = SecurityUtils.getCurrentUserId();

        // 获取用户当前选择的工作大类
        UserJobCategory userCategory = userJobCategoryMapper.selectCurrentCategoryByUserId(userId);
        if (userCategory == null) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "未找到当前工作大类");
        }

        return getPositionsByCategory(userCategory.getCategoryId());
    }
}