package com.interview.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.interview.entity.Tag;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TagMapper extends BaseMapper<Tag> {
}