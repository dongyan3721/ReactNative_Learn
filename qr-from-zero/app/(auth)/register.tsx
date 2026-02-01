import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { categoryApi } from '@/api/category';
import { CategoryCard } from '@/components/CategoryCard';
import { JobCategory } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Pressable } from '@/components/ui/pressable';
import { useToast, Toast, ToastTitle } from '@/components/ui/toast';

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [categories, setCategories] = useState<JobCategory[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    const { register, isLoading } = useAuth();
    const toast = useToast();

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await categoryApi.getAll();
            setCategories(response.data);
        } catch (error) {
            toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <Toast nativeID={id} action="error" variant="solid">
                        <ToastTitle>加载工作大类失败</ToastTitle>
                    </Toast>
                ),
            });
        }
    };

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <Toast nativeID={id} action="error" variant="solid">
                        <ToastTitle>请填写所有字段</ToastTitle>
                    </Toast>
                ),
            });
            return;
        }

        if (password !== confirmPassword) {
            toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <Toast nativeID={id} action="error" variant="solid">
                        <ToastTitle>两次密码输入不一致</ToastTitle>
                    </Toast>
                ),
            });
            return;
        }

        if (password.length < 6) {
            toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <Toast nativeID={id} action="error" variant="solid">
                        <ToastTitle>密码至少需要6个字符</ToastTitle>
                    </Toast>
                ),
            });
            return;
        }

        if (!selectedCategoryId) {
            toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <Toast nativeID={id} action="error" variant="solid">
                        <ToastTitle>请选择工作大类</ToastTitle>
                    </Toast>
                ),
            });
            return;
        }

        try {
            await register({
                email,
                password,
                categoryId: selectedCategoryId,
            });
        } catch (err: any) {
            toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <Toast nativeID={id} action="error" variant="solid">
                        <ToastTitle>{err}</ToastTitle>
                    </Toast>
                ),
            });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView>
                <Box className="flex-1 bg-white dark:bg-gray-900 px-1.5 py-8">
                    <Center>
                        <VStack space="xl" className="w-full max-w-xl">
                            <VStack space="xs">
                                <Heading size="3xl" className="text-primary-900 dark:text-primary-100">
                                    创建账号
                                </Heading>
                                <Text className="text-lg text-gray-600 dark:text-gray-400">
                                    开始你的面试准备之旅
                                </Text>
                            </VStack>

                            <VStack space="md" className="w-full">
                                <FormControl isRequired>
                                    <FormControlLabel>
                                        <FormControlLabelText className="text-gray-700 dark:text-gray-300">
                                            邮箱地址
                                        </FormControlLabelText>
                                    </FormControlLabel>
                                    <Input variant="outline" size="lg" className="border-gray-300 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400 bg-white dark:bg-gray-800">
                                        <InputField
                                            placeholder="请输入邮箱"
                                            value={email}
                                            onChangeText={setEmail}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            className="text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                        />
                                    </Input>
                                </FormControl>

                                <FormControl isRequired>
                                    <FormControlLabel>
                                        <FormControlLabelText className="text-gray-700 dark:text-gray-300">
                                            密码
                                        </FormControlLabelText>
                                    </FormControlLabel>
                                    <Input variant="outline" size="lg" className="border-gray-300 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400 bg-white dark:bg-gray-800">
                                        <InputField
                                            placeholder="密码（至少6位）"
                                            value={password}
                                            onChangeText={setPassword}
                                            type="password"
                                            autoCapitalize="none"
                                            className="text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                        />
                                    </Input>
                                </FormControl>

                                <FormControl isRequired>
                                    <FormControlLabel>
                                        <FormControlLabelText className="text-gray-700 dark:text-gray-300">
                                            确认密码
                                        </FormControlLabelText>
                                    </FormControlLabel>
                                    <Input variant="outline" size="lg" className="border-gray-300 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400 bg-white dark:bg-gray-800">
                                        <InputField
                                            placeholder="请再次输入密码"
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                            type="password"
                                            autoCapitalize="none"
                                            className="text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                        />
                                    </Input>
                                </FormControl>
                            </VStack>

                            <VStack space="md" className="w-full">
                                <FormControl isRequired>
                                  <FormControlLabel>
                                    <FormControlLabelText className="text-gray-700 dark:text-gray-300">选择工作大类</FormControlLabelText>
                                  </FormControlLabel>
                                    <Text className="text-xs text-gray-500 dark:text-gray-400 mb-2">（注册后可以切换）</Text>
                                    {categories.map((category) => (
                                        <CategoryCard
                                            key={category.categoryId}
                                            category={category}
                                            isSelected={selectedCategoryId === category.categoryId}
                                            onPress={() => setSelectedCategoryId(category.categoryId)}
                                        />
                                    ))}
                                </FormControl>
                            </VStack>

                            <Button
                                size="lg"
                                onPress={handleRegister}
                                isDisabled={isLoading}
                                className="bg-primary-700 dark:bg-primary-600 active:bg-primary-600 dark:active:bg-primary-500 disabled:bg-gray-300 dark:disabled:bg-gray-700 w-full"
                            >
                                <ButtonText className="text-white dark:text-gray-900 font-semibold">
                                    {isLoading ? '注册中...' : '注册'}
                                </ButtonText>
                            </Button>

                            <Link href="/(auth)/login" asChild>
                                <Pressable className="mt-4">
                                    <Text className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-center">
                                        已有账号？返回登录
                                    </Text>
                                </Pressable>
                            </Link>
                        </VStack>
                    </Center>
                </Box>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}