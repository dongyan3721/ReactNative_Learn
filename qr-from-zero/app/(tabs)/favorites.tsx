import React, { useState, useCallback } from 'react';
import { RefreshControl, FlatList } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { questionApi } from '@/api/question';
import { QuestionCard } from '@/components/QuestionCard';
import { Question } from '@/types';
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Spinner } from '@/components/ui/spinner';
import { useToast, Toast, ToastTitle } from '@/components/ui/toast';

export default function FavoritesScreen() {
    const router = useRouter();
    const [favorites, setFavorites] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const toast = useToast();

    const loadFavorites = useCallback(async () => {
        try {
            const response = await questionApi.getFavorites();
            setFavorites(response.data);
        } catch (error) {
            toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <Toast nativeID={id} action="error" variant="solid">
                        <ToastTitle>加载收藏失败</ToastTitle>
                    </Toast>
                ),
            });
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, [toast]);

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            loadFavorites();
        }, [loadFavorites])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadFavorites();
    };

    if (isLoading && !refreshing) {
        return (
            <Center className="flex-1 bg-white dark:bg-gray-900">
                <Spinner size="large" />
            </Center>
        );
    }

    if (favorites.length === 0) {
        return (
            <Center className="flex-1 bg-white dark:bg-gray-900">
                <Heading size="lg" className="text-gray-600 dark:text-gray-400">还没有收藏题目</Heading>
                <Text className="mt-2 text-gray-500 dark:text-gray-500">在做题时点击星标即可收藏</Text>
            </Center>
        );
    }

    return (
        <Box className="flex-1 bg-white dark:bg-gray-900">
            <FlatList
                data={favorites}
                keyExtractor={(item) => item.questionId.toString()}
                contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 16 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListHeaderComponent={
                    <Box className="pb-3">
                        <Text className="text-sm text-gray-600 dark:text-gray-400">
                            共收藏 {favorites.length} 道题目
                        </Text>
                    </Box>
                }
                renderItem={({ item }) => (
                    <QuestionCard
                        question={item}
                        onPress={() =>
                            router.push(`/question/${item.topicId}/0`)
                        }
                        showAnswer
                    />
                )}
            />
        </Box>
    );
}