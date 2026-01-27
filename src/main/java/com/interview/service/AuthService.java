package com.interview.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.interview.common.ResultCode;
import com.interview.dto.request.LoginRequest;
import com.interview.dto.request.RegisterRequest;
import com.interview.dto.response.LoginResponse;
import com.interview.entity.JobCategory;
import com.interview.entity.User;
import com.interview.entity.UserJobCategory;
import com.interview.exception.BusinessException;
import com.interview.mapper.JobCategoryMapper;
import com.interview.mapper.UserJobCategoryMapper;
import com.interview.mapper.UserMapper;
import com.interview.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserMapper userMapper;
    private final JobCategoryMapper categoryMapper;
    private final UserJobCategoryMapper userJobCategoryMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional(rollbackFor = Exception.class)
    public LoginResponse register(RegisterRequest request) {
        // 检查邮箱是否已存在
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getEmail, request.getEmail());
        if (userMapper.selectCount(wrapper) > 0) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "该邮箱已被注册");
        }

        // 验证工作大类是否存在
        JobCategory category = categoryMapper.selectById(request.getCategoryId());
        if (category == null) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "工作大类不存在");
        }

        // 创建用户
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setIsActive(true);
        user.setIsPremium(false);
        userMapper.insert(user);

        // 创建用户工作大类关联
        UserJobCategory userCategory = new UserJobCategory();
        userCategory.setUserId(user.getUserId());
        userCategory.setCategoryId(request.getCategoryId());
        userCategory.setIsCurrentSelection(true);
        userJobCategoryMapper.insert(userCategory);

        // 生成Token
        String token = jwtUtil.generateToken(user.getUserId(), user.getEmail());

        // 清除密码字段
        user.setPasswordHash(null);

        return new LoginResponse(token, user);
    }

    public LoginResponse login(LoginRequest request) {
        // 查询用户
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getEmail, request.getEmail());
        User user = userMapper.selectOne(wrapper);

        if (user == null) {
            throw new BusinessException(ResultCode.UNAUTHORIZED.getCode(), "邮箱或密码错误");
        }

        // 验证密码
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BusinessException(ResultCode.UNAUTHORIZED.getCode(), "邮箱或密码错误");
        }

        // 更新最后登录时间
        user.setLastLoginAt(LocalDateTime.now());
        userMapper.updateById(user);

        // 生成Token
        String token = jwtUtil.generateToken(user.getUserId(), user.getEmail());

        // 清除密码字段
        user.setPasswordHash(null);

        return new LoginResponse(token, user);
    }
}