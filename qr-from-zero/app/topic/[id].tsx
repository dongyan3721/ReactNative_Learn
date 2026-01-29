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
import { questionApi } from '@/api/question';
import { QuestionCard } from '@/components/QuestionCard';
import { Question } from '@/types';

export default function QuestionListScreen() {
    const { id: topicId, topicName } = useLocalSearchParams<{
        id: string;
        topicName: string;
    }>();
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (topicId) {
            loadQuestions();
        }
    }, [topicId]);

    const loadQuestions = async () => {
        try {
            const response = await questionApi.getByTopic(Number(topicId), 1, 100);
            setQuestions(response.data.questions);
        } catch (error) {
            Alert.alert('错误', '加载题目失败');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadQuestions();
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
            <Stack.Screen options={{ title: topicName || '题目列表' }} />
            <View style={styles.container}>
                <FlatList
                    data={questions}
                    keyExtractor={(item) => item.questionId.toString()}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListHeaderComponent={
                        <View style={styles.header}>
                            <Text style={styles.headerText}>
                                共 {questions.length} 道题目
                            </Text>
                        </View>
                    }
                    renderItem={({ item, index }) => (
                        <QuestionCard
                            question={item}
                            onPress={() =>
                                router.push(`/question/${topicId}/${index}`)
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
    header: {
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    headerText: {
        fontSize: 14,
        color: '#666',
    },
});