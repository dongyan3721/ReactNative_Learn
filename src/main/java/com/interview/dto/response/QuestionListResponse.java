package com.interview.dto.response;

import com.interview.entity.Question;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class QuestionListResponse {
    private List<Question> questions;
    private Long total;
    private Integer page;
    private Integer pageSize;
    private Integer totalPages;
}