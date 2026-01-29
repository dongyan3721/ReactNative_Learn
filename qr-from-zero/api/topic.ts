import apiClient from './client';
import { ExamTopic } from '@/types';

export const topicApi = {
    getByPosition: (positionId: number) =>
        apiClient.get<any, { data: ExamTopic[] }>(`/topics/position/${positionId}`),
};