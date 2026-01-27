package com.interview.controller;

import com.interview.common.Result;
import com.interview.entity.Position;
import com.interview.service.PositionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/positions")
@RequiredArgsConstructor
public class PositionController {

    private final PositionService positionService;

    @GetMapping
    public Result<List<Position>> getCurrentUserPositions() {
        List<Position> positions = positionService.getCurrentUserPositions();
        return Result.success(positions);
    }

    @GetMapping("/category/{categoryId}")
    public Result<List<Position>> getPositionsByCategory(@PathVariable Integer categoryId) {
        List<Position> positions = positionService.getPositionsByCategory(categoryId);
        return Result.success(positions);
    }
}