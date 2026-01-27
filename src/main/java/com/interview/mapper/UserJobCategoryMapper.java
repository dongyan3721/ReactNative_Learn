package com.interview.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.interview.entity.UserJobCategory;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserJobCategoryMapper extends BaseMapper<UserJobCategory> {

    @Select("SELECT ujc.*, jc.* FROM UserJobCategories ujc " +
            "LEFT JOIN JobCategories jc ON ujc.CategoryId = jc.CategoryId " +
            "WHERE ujc.UserId = #{userId} AND ujc.IsCurrentSelection = 1")
    UserJobCategory selectCurrentCategoryByUserId(Integer userId);
}