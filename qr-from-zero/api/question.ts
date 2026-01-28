import apiClient from './client';
import { Question, QuestionListResponse, AnswerCardItem } from '@/types';

export const questionApi = {
    getByTopic: (topicId: number, page = 1, pageSize = 20) =>
        apiClient.get<any, { data: QuestionListResponse }>(
            `/questions/topic/${topicId}`,
            { params: { page, pageSize: pageSize } }
        ),

    getDetail: (questionId: number) =>
        apiClient.get<any, { data: Question }>(`/questions/${questionId}`),

    toggleFavorite: (questionId: number) =>
        apiClient.post<any, { data: { isFavorited: boolean; message: string } }>(
            `/questions/${questionId}/favorite`
        ),

    getFavorites: () =>
        apiClient.get<any, { data: Question[] }>('/questions/favorites'),

    getAnswerCard: (topicId: number) =>
        apiClient.get<any, { data: AnswerCardItem[] }>(`/answer-card/topic/${topicId}`),
};