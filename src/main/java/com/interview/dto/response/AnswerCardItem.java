package com.interview.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AnswerCardItem {
    private Integer questionId;
    private String title;
    private String difficulty;
    private Integer viewCount;
    private LocalDateTime lastViewedAt;
    private Boolean isViewed;
}