import apiClient from './client';
import { JobCategory } from '@/types';

export const categoryApi = {
    getAll: () =>
        apiClient.get<any, { data: JobCategory[] }>('/categories'),

    getCurrent: () =>
        apiClient.get<any, { data: JobCategory }>('/categories/current'),

    switch: (categoryId: number) =>
        apiClient.post<any, { data: { message: string } }>('/categories/switch', {
            category_id: categoryId,
        }),
};