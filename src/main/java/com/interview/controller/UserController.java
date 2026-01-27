package com.interview.controller;

import com.interview.common.Result;
import com.interview.common.SecurityUtils;
import com.interview.entity.User;
import com.interview.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserMapper userMapper;

    @GetMapping("/profile")
    public Result<User> getProfile() {
        Integer userId = SecurityUtils.getCurrentUserId();
        User user = userMapper.selectById(userId);
        if (user != null) {
            user.setPasswordHash(null);
        }
        return Result.success(user);
    }

    @PutMapping("/profile")
    public Result<String> updateProfile(@RequestBody Map<String, String> request) {
        Integer userId = SecurityUtils.getCurrentUserId();
        User user = userMapper.selectById(userId);

        if (user != null) {
            if (request.containsKey("username")) {
                user.setUsername(request.get("username"));
            }
            if (request.containsKey("avatar")) {
                user.setAvatar(request.get("avatar"));
            }
            userMapper.updateById(user);
        }

        return Result.success("更新成功");
    }
}