import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {useRouter, useSegments} from 'expo-router';
import authStorage from '@/utils/auth';
import {authApi, LoginRequest, RegisterRequest} from "@/api/auth";
import {User} from "@/types";
import {Alert} from "react-native";

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  isLoading: false,
  login: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  },
  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },
  register: () => new Promise(resolve => setTimeout(resolve, 1000))
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({children}: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // 初始化时检查本地存储的 token
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = await authStorage.getToken();
        // TODO 跑后端验一下这个token行不行

        // 还没超时的话后端会返一个新token，给他set进去


        // 超时了就直接跳登录吧

        setToken(storedToken);
      } catch (error) {
        console.error('初始化鉴权失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // 根据鉴权状态进行路由守卫
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!token && !inAuthGroup) {
      // 未登录且不在登录页，跳转到登录页
      router.replace('/(auth)/login');
    } else if (token && inAuthGroup) {
      // 已登录且在登录页，跳转到首页
      router.replace('/(tabs)');
    }
  }, [token, segments, isLoading]);

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(data);
      setToken(res.data.token);
      setUser(res.data.user);
      await authStorage.setToken(res.data.token);
      await authStorage.setUser(res.data.user);
      router.replace('/(tabs)');
    }catch (error) {
      // @ts-ignore
      Alert.alert('错误', error)
    }finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authStorage.clear();
      setToken(null);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('登出失败:', error);
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    const res = await authApi.register(data);
    setToken(res.data.token);
    setUser(res.data.user);
    await authStorage.setToken(res.data.token);
    await authStorage.setUser(res.data.user);
    setIsLoading(false);
    router.replace('/(tabs)');
  }

  return (
      <AuthContext.Provider value={{user, token, isLoading, login, logout, register}}>
        {children}
      </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
