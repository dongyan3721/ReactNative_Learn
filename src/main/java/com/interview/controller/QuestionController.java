package com.interview.controller;

import com.interview.common.Result;
import com.interview.dto.response.FavoriteResponse;
import com.interview.dto.response.QuestionListResponse;
import com.interview.entity.Question;
import com.interview.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping("/topic/{topicId}")
    public Result<QuestionListResponse> getQuestionsByTopic(
            @PathVariable Integer topicId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        QuestionListResponse response = questionService.getQuestionsByTopic(topicId, page, pageSize);
        return Result.success(response);
    }

    @GetMapping("/{questionId}")
    public Result<Question> getQuestionDetail(@PathVariable Integer questionId) {
        Question question = questionService.getQuestionDetail(questionId);
        return Result.success(question);
    }

    @PostMapping("/{questionId}/favorite")
    public Result<FavoriteResponse> toggleFavorite(@PathVariable Integer questionId) {
        FavoriteResponse response = questionService.toggleFavorite(questionId);
        return Result.success(response);
    }

    @GetMapping("/favorites")
    public Result<List<Question>> getFavorites() {
        List<Question> favorites = questionService.getFavorites();
        return Result.success(favorites);
    }
}