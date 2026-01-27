package com.interview.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.interview.common.ResultCode;
import com.interview.common.SecurityUtils;
import com.interview.dto.response.AnswerCardItem;
import com.interview.dto.response.FavoriteResponse;
import com.interview.dto.response.QuestionListResponse;
import com.interview.entity.*;
import com.interview.exception.BusinessException;
import com.interview.mapper.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionMapper questionMapper;
    private final UserFavoriteMapper favoriteMapper;
    private final UserAnswerHistoryMapper historyMapper;

    public QuestionListResponse getQuestionsByTopic(Integer topicId, Integer page, Integer pageSize) {
        Integer userId = SecurityUtils.getCurrentUserId();

        // 分页查询题目
        Page<Question> pageParam = new Page<>(page, pageSize);
        IPage<Question> questionPage = questionMapper.selectQuestionsByTopicId(pageParam, topicId);

        List<Question> questions = questionPage.getRecords();

        // 获取题目ID列表
        List<Integer> questionIds = questions.stream()
                .map(Question::getQuestionId)
                .collect(Collectors.toList());

        if (!questionIds.isEmpty()) {
            // 查询标签
            for (Question question : questions) {
                List<Tag> tags = questionMapper.selectTagsByQuestionId(question.getQuestionId());
                question.setTags(tags);
            }

            // 查询收藏状态
            LambdaQueryWrapper<UserFavorite> favoriteWrapper = new LambdaQueryWrapper<>();
            favoriteWrapper.eq(UserFavorite::getUserId, userId)
                    .in(UserFavorite::getQuestionId, questionIds);
            List<UserFavorite> favorites = favoriteMapper.selectList(favoriteWrapper);
            Map<Integer, Boolean> favoriteMap = favorites.stream()
                    .collect(Collectors.toMap(UserFavorite::getQuestionId, f -> true));

            questions.forEach(q -> q.setIsFavorited(favoriteMap.getOrDefault(q.getQuestionId(), false)));
        }

        return new QuestionListResponse(
                questions,
                questionPage.getTotal(),
                page,
                pageSize,
                (int) questionPage.getPages()
        );
    }

    public Question getQuestionDetail(Integer questionId) {
        Integer userId = SecurityUtils.getCurrentUserId();

        Question question = questionMapper.selectById(questionId);
        if (question == null) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "题目不存在");
        }

        // 查询标签
        List<Tag> tags = questionMapper.selectTagsByQuestionId(questionId);
        question.setTags(tags);

        // 查询收藏状态
        LambdaQueryWrapper<UserFavorite> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserFavorite::getUserId, userId)
                .eq(UserFavorite::getQuestionId, questionId);
        long count = favoriteMapper.selectCount(wrapper);
        question.setIsFavorited(count > 0);

        // 异步记录浏览历史
        recordViewHistory(userId, questionId);

        return question;
    }

    @Transactional(rollbackFor = Exception.class)
    public FavoriteResponse toggleFavorite(Integer questionId) {
        Integer userId = SecurityUtils.getCurrentUserId();

        LambdaQueryWrapper<UserFavorite> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserFavorite::getUserId, userId)
                .eq(UserFavorite::getQuestionId, questionId);
        UserFavorite favorite = favoriteMapper.selectOne(wrapper);

        if (favorite == null) {
            // 添加收藏
            UserFavorite newFavorite = new UserFavorite();
            newFavorite.setUserId(userId);
            newFavorite.setQuestionId(questionId);
            favoriteMapper.insert(newFavorite);
            return new FavoriteResponse(true, "收藏成功");
        } else {
            // 取消收藏
            favoriteMapper.deleteById(favorite.getFavoriteId());
            return new FavoriteResponse(false, "取消收藏成功");
        }
    }

    public List<Question> getFavorites() {
        Integer userId = SecurityUtils.getCurrentUserId();

        LambdaQueryWrapper<UserFavorite> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserFavorite::getUserId, userId)
                .orderByDesc(UserFavorite::getFavoritedAt);
        List<UserFavorite> favorites = favoriteMapper.selectList(wrapper);

        List<Question> questions = new ArrayList<>();
        for (UserFavorite favorite : favorites) {
            Question question = questionMapper.selectById(favorite.getQuestionId());
            if (question != null) {
                List<Tag> tags = questionMapper.selectTagsByQuestionId(question.getQuestionId());
                question.setTags(tags);
                question.setIsFavorited(true);
                questions.add(question);
            }
        }

        return questions;
    }

    public List<AnswerCardItem> getAnswerCard(Integer topicId) {
        Integer userId = SecurityUtils.getCurrentUserId();

        // 获取该考点下的所有题目
        LambdaQueryWrapper<Question> questionWrapper = new LambdaQueryWrapper<>();
        questionWrapper.eq(Question::getTopicId, topicId)
                .eq(Question::getIsActive, true)
                .orderByAsc(Question::getSortOrder, Question::getQuestionId)
                .select(Question::getQuestionId, Question::getTitle, Question::getDifficulty);
        List<Question> questions = questionMapper.selectList(questionWrapper);

        // 获取用户的答题记录
        List<Integer> questionIds = questions.stream()
                .map(Question::getQuestionId)
                .collect(Collectors.toList());

        Map<Integer, UserAnswerHistory> historyMap = Map.of();
        if (!questionIds.isEmpty()) {
            LambdaQueryWrapper<UserAnswerHistory> historyWrapper = new LambdaQueryWrapper<>();
            historyWrapper.eq(UserAnswerHistory::getUserId, userId)
                    .in(UserAnswerHistory::getQuestionId, questionIds);
            List<UserAnswerHistory> histories = historyMapper.selectList(historyWrapper);
            historyMap = histories.stream()
                    .collect(Collectors.toMap(UserAnswerHistory::getQuestionId, h -> h));
        }

        // 构建答题卡数据
        List<AnswerCardItem> answerCard = new ArrayList<>();
        for (Question question : questions) {
            AnswerCardItem item = new AnswerCardItem();
            item.setQuestionId(question.getQuestionId());
            item.setTitle(question.getTitle());
            item.setDifficulty(question.getDifficulty());

            UserAnswerHistory history = historyMap.get(question.getQuestionId());
            if (history != null) {
                item.setViewCount(history.getViewCount());
                item.setLastViewedAt(history.getLastViewedAt());
                item.setIsViewed(true);
            } else {
                item.setViewCount(0);
                item.setIsViewed(false);
            }

            answerCard.add(item);
        }

        return answerCard;
    }

    private void recordViewHistory(Integer userId, Integer questionId) {
        LambdaQueryWrapper<UserAnswerHistory> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserAnswerHistory::getUserId, userId)
                .eq(UserAnswerHistory::getQuestionId, questionId);
        UserAnswerHistory history = historyMapper.selectOne(wrapper);

        if (history == null) {
            // 创建新记录
            UserAnswerHistory newHistory = new UserAnswerHistory();
            newHistory.setUserId(userId);
            newHistory.setQuestionId(questionId);
            newHistory.setViewCount(1);
            historyMapper.insert(newHistory);
        } else {
            // 更新记录
            history.setViewCount(history.getViewCount() + 1);
            history.setLastViewedAt(LocalDateTime.now());
            historyMapper.updateById(history);
        }

        // 更新题目浏览次数
        Question question = questionMapper.selectById(questionId);
        if (question != null) {
            question.setViewCount(question.getViewCount() + 1);
            questionMapper.updateById(question);
        }
    }
}