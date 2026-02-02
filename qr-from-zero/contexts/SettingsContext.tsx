// import { useColorScheme } from 'react-native';
//
// // 管理用户喜好，比如黑夜模式等等
// const colorScheme = useColorScheme();
// 个人设置里面给一个开关是否要跟随系统

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 定义偏好设置的数据结构
interface UserSettings {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
    language: 'zh' | 'en';
}

interface SettingsContextType {
    settings: UserSettings;
    updateSetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const [settings, setSettings] = useState<UserSettings>({
        theme: 'system',
        fontSize: 'medium',
        language: 'zh',
    });

    // 初始化加载本地配置
    useEffect(() => {
        const loadSettings = async () => {
            const saved = await AsyncStorage.getItem('user_settings');
            if (saved) setSettings(JSON.parse(saved));
        };
        loadSettings();
    }, []);

    // 更新配置并持久化
    const updateSetting = async <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        await AsyncStorage.setItem('user_settings', JSON.stringify(newSettings));
    };

    // 判定当前真正该显示的颜色模式


    return (
        <SettingsContext.Provider value={{ settings, updateSetting }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error('useSettings must be used within SettingsProvider');
    return context;
};
