import apiClient from './client';
import { Position } from '@/types';

export const positionApi = {
    getCurrentUserPositions: () =>
        apiClient.get<any, { data: Position[] }>('/positions'),

    getByCategory: (categoryId: number) =>
        apiClient.get<any, { data: Position[] }>(`/positions/category/${categoryId}`),
};