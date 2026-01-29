// @ts-ignore
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { Link } from 'expo-router';
// @ts-ignore
import { categoryApi } from '@/api/category';
import { CategoryCard } from '@/components/CategoryCard';
import { JobCategory } from '@/types';
import {useAuth} from "@/contexts/AuthContext";

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [categories, setCategories] = useState<JobCategory[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    const {register, isLoading}  = useAuth()

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await categoryApi.getAll();
            setCategories(response.data);
        } catch (error) {
            Alert.alert('错误', '加载工作大类失败');
        }
    };

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('错误', '请填写所有字段');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('错误', '两次密码输入不一致');
            return;
        }

        if (password.length < 6) {
            Alert.alert('错误', '密码至少需要6个字符');
            return;
        }

        if (!selectedCategoryId) {
            Alert.alert('错误', '请选择工作大类');
            return;
        }

        try {
            await register({
                    email,
                    password,
                    categoryId: selectedCategoryId,
                }
            )
        } catch (err: any) {
            Alert.alert('注册失败', err);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>创建账号</Text>
            <Text style={styles.subtitle}>开始你的面试准备之旅</Text>

            <TextInput
                style={styles.input}
                placeholder="邮箱地址"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />

            <TextInput
                style={styles.input}
                placeholder="密码（至少6位）"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="确认密码"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
            />

            <Text style={styles.sectionTitle}>选择工作大类 *</Text>
            <Text style={styles.sectionSubtitle}>（注册后可以切换）</Text>

            {categories.map((category) => (
                <CategoryCard
                    key={category.categoryId}
                    category={category}
                    isSelected={selectedCategoryId === category.categoryId}
                    onPress={() => setSelectedCategoryId(category.categoryId)}
                />
            ))}

            <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={isLoading}
            >
                <Text style={styles.buttonText}>
                    {isLoading ? '注册中...' : '注册'}
                </Text>
            </TouchableOpacity>

            <Link href="/(auth)/login" asChild>
                <TouchableOpacity style={styles.linkButton}>
                    <Text style={styles.linkText}>已有账号？返回登录</Text>
                </TouchableOpacity>
            </Link>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    content: {
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
        marginTop: 24,
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 13,
        color: '#999',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 24,
    },
    buttonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
    },
    linkButton: {
        marginTop: 16,
        marginBottom: 32,
        alignItems: 'center',
    },
    linkText: {
        color: '#007AFF',
        fontSize: 15,
    },
});