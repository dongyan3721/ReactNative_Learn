package com.interview.service;

import com.interview.entity.ExamTopic;
import com.interview.mapper.ExamTopicMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TopicService {

    private final ExamTopicMapper topicMapper;

    public List<ExamTopic> getTopicsByPosition(Integer positionId) {
        return topicMapper.selectByPositionIdWithCount(positionId);
    }
}