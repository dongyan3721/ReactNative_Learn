import React, { useState, useEffect, useCallback } from 'react';
import {FlatList, RefreshControl, ScrollView} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { questionApi } from '@/api/question';
import { QuestionCard } from '@/components/QuestionCard';
import { Question } from '@/types';
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { Spinner } from '@/components/ui/spinner';
import { useToast, Toast, ToastTitle } from '@/components/ui/toast';
import {useSafeAreaInsets} from "react-native-safe-area-context";

export default function QuestionListScreen() {
    const insets = useSafeAreaInsets();
    const { id: topicId, topicName } = useLocalSearchParams<{
        id: string;
        topicName: string;
    }>();
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const toast = useToast();

    const loadQuestions = useCallback(async () => {
        if (!topicId) return;
        try {
            const response = await questionApi.getByTopic(Number(topicId), 1, 100);
            setQuestions(response.data.questions);
        } catch (error) {
            toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <Toast nativeID={id} action="error" variant="solid">
                        <ToastTitle>加载题目失败</ToastTitle>
                    </Toast>
                ),
            });
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, [topicId, toast]);

    useEffect(() => {
        loadQuestions();
    }, [loadQuestions]);

    const onRefresh = () => {
        setRefreshing(true);
        loadQuestions();
    };

    if (isLoading && !refreshing) {
        return (
            <Center className="flex-1 bg-white dark:bg-gray-900">
                <Spinner size="large" />
            </Center>
        );
    }

    return (
        <Box style={{paddingTop: insets.top, paddingBottom: insets.bottom}} className="flex-1 bg-gray-50 dark:bg-black">
            <FlatList
                data={questions}
                keyExtractor={(item) => item.questionId.toString()}
                contentContainerStyle={{ paddingVertical: 16 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListHeaderComponent={
                    <Box className="px-4 pb-4">
                        <Text className="text-sm text-gray-500 dark:text-gray-400">
                            共 {questions.length} 道题目
                        </Text>
                    </Box>
                }
                renderItem={({ item, index }) => (
                    <QuestionCard
                        question={item}
                        onPress={() =>
                            router.push(`/question/${topicId}/${index}`)
                        }
                    />
                )}
                ListEmptyComponent={
                    <Center className="mt-20">
                        <Text className="text-gray-500">该考点下暂无题目</Text>
                    </Center>
                }
            />
        </Box>
    );
}