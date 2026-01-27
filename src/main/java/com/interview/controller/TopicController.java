package com.interview.controller;

import com.interview.common.Result;
import com.interview.entity.ExamTopic;
import com.interview.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;

    @GetMapping("/position/{positionId}")
    public Result<List<ExamTopic>> getTopicsByPosition(@PathVariable Integer positionId) {
        List<ExamTopic> topics = topicService.getTopicsByPosition(positionId);
        return Result.success(topics);
    }
}