// @ts-ignore
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { topicApi } from '@/api/topic';
import { TopicItem } from '@/components/TopicItem';
import { ExamTopic } from '@/types';

export default function TopicListScreen() {
    const { id: positionId } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [topics, setTopics] = useState<ExamTopic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (positionId) {
            loadTopics();
        }
    }, [positionId]);

    const loadTopics = async () => {
        try {
            const response = await topicApi.getByPosition(Number(positionId));
            setTopics(response.data);
        } catch (error) {
            Alert.alert('错误', '加载考点列表失败');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadTopics();
    };

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <Text>加载中...</Text>
            </View>
        );
    }

    return (
        <>
            <Stack.Screen options={{ title: '选择考点' }} />
            <View style={styles.container}>
                <FlatList
                    data={topics}
                    keyExtractor={(item) => item.topicId.toString()}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListHeaderComponent={
                        <Text style={styles.headerText}>选择考点开始刷题</Text>
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
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingVertical: 16,
    },
    headerText: {
        fontSize: 15,
        color: '#666',
        marginHorizontal: 16,
        marginBottom: 16,
    },
});