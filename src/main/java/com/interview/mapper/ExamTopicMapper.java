package com.interview.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.interview.entity.ExamTopic;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface ExamTopicMapper extends BaseMapper<ExamTopic> {

    @Select("SELECT et.*, " +
            "(SELECT COUNT(*) FROM Questions q WHERE q.TopicId = et.TopicId AND q.IsActive = 1) as questionCount " +
            "FROM ExamTopics et " +
            "WHERE et.PositionId = #{positionId} AND et.IsActive = 1 " +
            "ORDER BY et.SortOrder")
    List<ExamTopic> selectByPositionIdWithCount(Integer positionId);
}