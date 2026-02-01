import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { topicApi } from '@/api/topic';
import { TopicItem } from '@/components/TopicItem';
import { ExamTopic } from '@/types';
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { Spinner } from '@/components/ui/spinner';
import { useToast, Toast, ToastTitle } from '@/components/ui/toast';

export default function TopicListScreen() {
    const { id: positionId } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [topics, setTopics] = useState<ExamTopic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const toast = useToast();

    const loadTopics = useCallback(async () => {
        if (!positionId) return;
        try {
            const response = await topicApi.getByPosition(Number(positionId));
            setTopics(response.data);
        } catch (error) {
            toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <Toast nativeID={id} action="error" variant="solid">
                        <ToastTitle>加载考点列表失败</ToastTitle>
                    </Toast>
                ),
            });
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, [positionId, toast]);

    useEffect(() => {
        loadTopics();
    }, [loadTopics]);

    const onRefresh = () => {
        setRefreshing(true);
        loadTopics();
    };

    if (isLoading && !refreshing) {
        return (
            <Center className="flex-1 bg-white dark:bg-gray-900">
                <Spinner size="large" />
            </Center>
        );
    }

    return (
        <>
            <Stack.Screen options={{ title: '选择考点' }} />
            <Box className="flex-1 bg-gray-50 dark:bg-black">
                <FlatList
                    data={topics}
                    keyExtractor={(item) => item.topicId.toString()}
                    contentContainerStyle={{ paddingVertical: 16 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListHeaderComponent={
                        <Text className="text-sm text-gray-500 dark:text-gray-400 px-4 pb-4">
                            选择考点开始刷题
                        </Text>
                    }
                    renderItem={({ item }) => (
                        <TopicItem
                            topic={item}
                            onPress={() =>
                                router.push({
                                    pathname: `/topic/${item.topicId}`,
                                    params: { topicName: item.topicName },
                                })
                            }
                        />
                    )}
                    ListEmptyComponent={
                        <Center className="mt-20">
                            <Text className="text-gray-500">该职位下暂无考点</Text>
                        </Center>
                    }
                />
            </Box>
        </>
    );
}