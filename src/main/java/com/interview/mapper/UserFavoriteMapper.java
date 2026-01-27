package com.interview.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.interview.entity.UserFavorite;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserFavoriteMapper extends BaseMapper<UserFavorite> {
}