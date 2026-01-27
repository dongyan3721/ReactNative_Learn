package com.interview.controller;

import com.interview.common.Result;
import com.interview.dto.response.AnswerCardItem;
import com.interview.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/answer-card")
@RequiredArgsConstructor
public class AnswerCardController {

    private final QuestionService questionService;

    @GetMapping("/topic/{topicId}")
    public Result<List<AnswerCardItem>> getAnswerCard(@PathVariable Integer topicId) {
        List<AnswerCardItem> answerCard = questionService.getAnswerCard(topicId);
        return Result.success(answerCard);
    }
}
