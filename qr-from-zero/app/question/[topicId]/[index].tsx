// @ts-ignore
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { questionApi } from '@/api/question';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { AnswerSheet } from '@/components/AnswerSheet';
import { Question, AnswerCardItem } from '@/types';

export default function QuestionDetailScreen() {
    const { topicId, index } = useLocalSearchParams<{
        topicId: string;
        index: string;
    }>();

    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(Number(index) || 0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [answerCard, setAnswerCard] = useState<AnswerCardItem[]>([]);
    const [showAnswerSheet, setShowAnswerSheet] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const scrollViewRef = useRef<ScrollView>(null);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (topicId) {
            loadQuestions();
            loadAnswerCard();
        }
    }, [topicId]);

    useEffect(() => {
        setShowAnswer(false);
        scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [currentIndex]);

    const loadQuestions = async () => {
        try {
            const response = await questionApi.getByTopic(Number(topicId), 1, 100);
            setQuestions(response.data.questions);
        } catch (error) {
            Alert.alert('错误', '加载题目失败');
        } finally {
            setIsLoading(false);
        }
    };

    const loadAnswerCard = async () => {
        try {
            const response = await questionApi.getAnswerCard(Number(topicId));
            setAnswerCard(response.data);
        } catch (error) {
            console.error('加载答题卡失败', error);
        }
    };

    const currentQuestion = questions[currentIndex];

    const handleToggleFavorite = async () => {
        if (!currentQuestion) return;

        try {
            const response = await questionApi.toggleFavorite(currentQuestion.questionId);

            // 更新本地状态
            const updatedQuestions = [...questions];
            updatedQuestions[currentIndex].isFavorited = response.data.isFavorited;
            setQuestions(updatedQuestions);

            Alert.alert('成功', response.data.message);
        } catch (error) {
            Alert.alert('错误', '操作失败');
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            animateTransition(() => setCurrentIndex(currentIndex - 1));
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            animateTransition(() => setCurrentIndex(currentIndex + 1));
        }
    };

    const animateTransition = (callback: () => void) => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();

        setTimeout(callback, 150);
    };

    // 手势处理
    const panGesture = Gesture.Pan()
        .onEnd((event) => {
            if (event.translationX > 100) {
                handlePrevious();
            } else if (event.translationX < -100) {
                handleNext();
            }
        });

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <Text>加载中...</Text>
            </View>
        );
    }

    if (!currentQuestion) {
        return (
            <View style={styles.centerContainer}>
                <Text>没有题目</Text>
            </View>
        );
    }

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.container}>
                {/* 顶部工具栏 */}
                <View style={styles.toolbar}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backText}>← 返回</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.toolbarButton}
                        onPress={handleToggleFavorite}
                    >
                        <Text style={styles.toolbarIcon}>
                            {currentQuestion.isFavorited ? '★' : '☆'}
                        </Text>
                        <Text style={styles.toolbarText}>收藏</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.toolbarButton}
                        onPress={() => setShowAnswerSheet(true)}
                    >
                        <Text style={styles.toolbarIcon}>📋</Text>
                        <Text style={styles.toolbarText}>
                            {currentIndex + 1}/{questions.length}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.difficultyBadge}>
                        <Text style={styles.difficultyText}>{currentQuestion.difficulty}</Text>
                    </View>
                </View>

                {/* 题目内容区 */}
                <GestureDetector gesture={panGesture}>
                    <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                        <ScrollView
                            ref={scrollViewRef}
                            contentContainerStyle={styles.scrollContent}
                        >
                            {/* 题目标题 */}
                            <Text style={styles.questionTitle}>{currentQuestion.title}</Text>

                            {/* 标签 */}
                            {currentQuestion.tags && currentQuestion.tags.length > 0 && (
                                <View style={styles.tagsContainer}>
                                    {currentQuestion.tags.map((tag) => (
                                        <View
                                            key={tag.tagId}
                                            style={[
                                                styles.tag,
                                                { backgroundColor: tag.tagColor || '#E0E0E0' },
                                            ]}
                                        >
                                            <Text style={styles.tagText}>{tag.tagName}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {/* 题目内容 */}
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => setShowAnswer(true)}
                                style={styles.questionContent}
                            >
                                <MarkdownViewer content={currentQuestion.contentMd} />

                                {!showAnswer && (
                                    <View style={styles.tapHint}>
                                        <Text style={styles.tapHintText}>👆 轻触屏幕查看答案</Text>
                                    </View>
                                )}
                            </TouchableOpacity>

                            {/* 答案区域 */}
                            {showAnswer && (
                                <View style={styles.answerSection}>
                                    <View style={styles.answerHeader}>
                                        <Text style={styles.answerHeaderText}>答案解析</Text>
                                    </View>
                                    <MarkdownViewer content={currentQuestion.answerMd} />
                                </View>
                            )}
                        </ScrollView>
                    </Animated.View>
                </GestureDetector>

                {/* 底部导航栏 */}
                <View style={styles.navigation}>
                    <TouchableOpacity
                        style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
                        onPress={handlePrevious}
                        disabled={currentIndex === 0}
                    >
                        <Text style={styles.navButtonText}>← 上一题</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.navButton,
                            currentIndex === questions.length - 1 && styles.navButtonDisabled,
                        ]}
                        onPress={handleNext}
                        disabled={currentIndex === questions.length - 1}
                    >
                        <Text style={styles.navButtonText}>下一题 →</Text>
                    </TouchableOpacity>
                </View>

                {/* 答题卡弹窗 */}
                <AnswerSheet
                    visible={showAnswerSheet}
                    answerCard={answerCard}
                    currentIndex={currentIndex}
                    onClose={() => setShowAnswerSheet(false)}
                    onSelectQuestion={(index) => {
                        setCurrentIndex(index);
                        setShowAnswerSheet(false);
                    }}
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
    toolbar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: 50, // 为状态栏留出空间
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 16,
    },
    backText: {
        fontSize: 16,
        color: '#007AFF',
    },
    toolbarButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    toolbarIcon: {
        fontSize: 20,
        marginRight: 4,
    },
    toolbarText: {
        fontSize: 14,
        color: '#666',
    },
    difficultyBadge: {
        marginLeft: 'auto',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: '#007AFF',
    },
    difficultyText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    questionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a1a',
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: 2,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    tag: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '500',
    },
    questionContent: {
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    tapHint: {
        padding: 20,
        alignItems: 'center',
    },
    tapHintText: {
        fontSize: 15,
        color: '#007AFF',
        fontWeight: '500',
    },
    answerSection: {
        backgroundColor: '#F0F8FF',
        marginBottom: 8,
    },
    answerHeader: {
        backgroundColor: '#007AFF',
        padding: 12,
    },
    answerHeaderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    navigation: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingBottom: 24, // 为底部安全区域留出空间
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        justifyContent: 'space-between',
    },
    navButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        marginHorizontal: 8,
        alignItems: 'center',
    },
    navButtonDisabled: {
        backgroundColor: '#E0E0E0',
    },
    navButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
});
