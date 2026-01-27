package com.interview.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.interview.entity.Question;
import com.interview.entity.Tag;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface QuestionMapper extends BaseMapper<Question> {

    @Select("SELECT t.* FROM Tags t " +
            "INNER JOIN QuestionTags qt ON t.TagId = qt.TagId " +
            "WHERE qt.QuestionId = #{questionId}")
    List<Tag> selectTagsByQuestionId(Integer questionId);

    IPage<Question> selectQuestionsByTopicId(Page<Question> page, @Param("topicId") Integer topicId);
}