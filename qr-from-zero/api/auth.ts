import apiClient from './client';
import { User } from '@/types';

export interface RegisterRequest {
    email: string;
    password: string;
    categoryId: number;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export const authApi = {
    register: (data: RegisterRequest) =>
        apiClient.post<any, {data: AuthResponse}>('/auth/register', data),

    login: (data: LoginRequest) =>
        apiClient.post<any, {data: AuthResponse}>('/auth/login', data),
};