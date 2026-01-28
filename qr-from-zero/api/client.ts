import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useRouter} from "expo-router";
// import {Alert} from "react-native";

const API_BASE_URL = "http://192.168.2.24:8080/api/v1"

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器 - 添加Token
apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            // @ts-ignore
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器 - 处理错误
apiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        if (error.response?.status === 401) {
            // Token过期，清除本地存储并跳转到登录
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            // 可以在这里触发导航到登录页


        }
        return Promise.reject(error);
    }
);

export default apiClient;