package com.interview.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FavoriteResponse {
    private Boolean isFavorited;
    private String message;
}