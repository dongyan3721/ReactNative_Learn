// @ts-ignore
import React, {useState, useEffect, useRef, useReducer} from 'react';
import {
    ScrollView,
    Animated
} from 'react-native';
import {useLocalSearchParams, useRouter, Stack} from 'expo-router';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {questionApi} from '@/api/question';
import {MarkdownViewer} from '@/components/MarkdownViewer';
import {Question, AnswerCardItem} from '@/types';
import {Toast, ToastTitle, useToast} from "@/components/ui/toast";
import {Center} from "@/components/ui/center";
import {Spinner} from "@/components/ui/spinner";
import {Text} from "@/components/ui/text";
import {HStack} from "@/components/ui/hstack";
import {Pressable} from "@/components/ui/pressable";
import {ChevronLeft, ChevronRight, Grid3x3, Star} from "lucide-react-native";
import {Box} from "@/components/ui/box";
import {Badge, BadgeText} from "@/components/ui/badge";
import {Heading} from "@/components/ui/heading";
import {Button, ButtonText} from "@/components/ui/button";
import {AnswerSheet} from "@/components/AnswerSheet";
import {
    ANSWER_SHEET_ACTION, answerSheetInitialState, answerSheetReducer,
} from "@/state/question/useShowCloseAnswerSheetReduceStateKidding";

const DIFFICULTY_COLORS = {
    Easy: 'success',
    Medium: 'warning',
    Hard: 'error',
} as const;

export default function QuestionDetailScreen() {
    const {topicId, index} = useLocalSearchParams<{
        topicId: string;
        index: string;
    }>();
    const [answerSheetState, answerSheetDispatch] = useReducer(answerSheetReducer, answerSheetInitialState);
    const router = useRouter();
    const toast = useToast();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(Number(index) || 0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [answerCard, setAnswerCard] = useState<AnswerCardItem[]>([]);
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
        scrollViewRef.current?.scrollTo({y: 0, animated: false});
    }, [currentIndex]);

    const loadQuestions = async () => {
        try {
            const response = await questionApi.getByTopic(Number(topicId), 1, 100);
            setQuestions(response.data.questions);
        } catch (error) {
            toast.show({
                placement: 'top',
                render: ({id}) => (
                    <Toast nativeID={id} action="error" variant="solid">
                        <ToastTitle>加载题目失败</ToastTitle>
                    </Toast>
                ),
            });
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
            const response = await questionApi.toggleFavorite(
                currentQuestion.questionId
            );

            const updatedQuestions = [...questions];
            updatedQuestions[currentIndex].isFavorited = response.data.isFavorited;
            setQuestions(updatedQuestions);

            toast.show({
                placement: 'top',
                render: ({id}) => (
                    <Toast nativeID={id} action="success" variant="solid">
                        <ToastTitle>{response.data.message}</ToastTitle>
                    </Toast>
                ),
            });
        } catch (error) {
            toast.show({
                placement: 'top',
                render: ({id}) => (
                    <Toast nativeID={id} action="error" variant="solid">
                        <ToastTitle>操作失败</ToastTitle>
                    </Toast>
                ),
            });
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

    const panGesture = Gesture.Pan()
        // 只有横向位移超过阈值才激活（避免竖向滚动被抢）
        .activeOffsetX([-20, 20])
        // 竖向位移超过阈值就失败，让 ScrollView 接管
        .failOffsetY([-10, 10])
        .onEnd((event) => {
            if (event.translationX > 100) {
                console.log(111)
                handlePrevious();
            } else if (event.translationX < -100) {
                handleNext();
            }
        });

    if (isLoading) {
        return (
            <Center className="flex-1 bg-white dark:bg-gray-900">
                <Spinner size="large"/>
            </Center>
        );
    }

    if (!currentQuestion) {
        return (
            <Center className="flex-1 bg-white dark:bg-gray-900">
                <Text className="text-gray-900 dark:text-white">没有题目</Text>
            </Center>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: `${currentIndex + 1}/${questions.length}`,
                    headerRight: () => (
                        <HStack space="md" className="items-center">
                            <Pressable onPress={handleToggleFavorite}>
                                <Star
                                    size={24}
                                    fill={currentQuestion.isFavorited ? '#FFD700' : 'none'}
                                    color={currentQuestion.isFavorited ? '#FFD700' : '#6B7280'}
                                />
                            </Pressable>
                            <Pressable onPress={() => {
                                answerSheetDispatch({type: ANSWER_SHEET_ACTION.OPEN_ANSWER_SHEET})
                            }}>
                                <Grid3x3 size={24} color="#6B7280"/>
                            </Pressable>
                        </HStack>
                    ),
                }}
            />

            <Box className="flex-1 bg-white dark:bg-gray-900">
                <GestureDetector gesture={panGesture}>
                    <Animated.View style={{flex: 1, opacity: fadeAnim}}>
                        <ScrollView
                            ref={scrollViewRef}
                            contentContainerStyle={{paddingBottom: 80}}
                        >
                            {/* 题目头部 */}
                            <Box className="bg-white dark:bg-gray-900 p-4 mb-2">
                                <HStack className="justify-between items-center mb-3">
                                    <Badge
                                        size="md"
                                        variant="solid"
                                        action={DIFFICULTY_COLORS[currentQuestion.difficulty]}
                                    >
                                        <BadgeText>{currentQuestion.difficulty}</BadgeText>
                                    </Badge>
                                    <Text size="xs" className="text-black dark:text-white">
                                        浏览 {currentQuestion.viewCount} 次
                                    </Text>
                                </HStack>

                                <Heading size="lg" className="text-black dark:text-white mb-3">
                                    {currentQuestion.title}
                                </Heading>

                                {currentQuestion.tags && currentQuestion.tags.length > 0 && (
                                    <HStack className="flex-wrap gap-2">
                                        {currentQuestion.tags.map((tag) => (
                                            <Badge
                                                key={tag.tagId}
                                                size="sm"
                                                variant="outline"
                                                action="muted"
                                            >
                                                <BadgeText>{tag.tagName}</BadgeText>
                                            </Badge>
                                        ))}
                                    </HStack>
                                )}
                            </Box>

                            {/* 题目内容 */}
                            <Pressable
                                onPress={() => setShowAnswer(true)}
                                disabled={showAnswer}
                            >
                                <Box className="bg-white dark:bg-gray-900 mb-2">
                                    <MarkdownViewer content={currentQuestion.contentMd}/>

                                    {!showAnswer && (
                                        <Center className="mt-6 py-4">
                                            <Text size="md" className="text-gray-700 dark:text-gray-300 font-bold">
                                                👆 轻触屏幕查看答案
                                            </Text>
                                        </Center>
                                    )}
                                </Box>
                            </Pressable>

                            {/* 答案区域 */}
                            {showAnswer && (
                                <Box className="bg-[#E1EFFE] dark:bg-gray-900 mb-2">
                                    <Box className="bg-[#1A56DB] p-3">
                                        <Text size="md" className="font-bold text-white">
                                            答案解析
                                        </Text>
                                    </Box>
                                    <Box>
                                        <MarkdownViewer content={currentQuestion.answerMd}/>
                                    </Box>
                                </Box>
                            )}
                        </ScrollView>
                    </Animated.View>
                </GestureDetector>

                {/* 底部导航栏 */}
                <Box
                    className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 p-4 pb-6">
                    <HStack space="md">
                        <Button
                            className="flex-1 bg-orange-400 dark:bg-orange-100"
                            variant="solid"
                            onPress={handlePrevious}
                            isDisabled={currentIndex === 0}
                        >
                            <HStack space="xs" className="items-center">
                                <ChevronLeft size={20}/>
                                <ButtonText>上一题</ButtonText>
                            </HStack>
                        </Button>

                        <Button
                            className="flex-1 bg-orange-400 dark:bg-orange-100"
                            variant="solid"
                            onPress={handleNext}
                            isDisabled={currentIndex === questions.length - 1}
                        >
                            <HStack space="xs" className="items-center">
                                <ButtonText>下一题</ButtonText>
                                <ChevronRight size={20}/>
                            </HStack>
                        </Button>
                    </HStack>
                </Box>

                <AnswerSheet visible={answerSheetState.showAnswerSheet} answerCard={answerCard}
                             currentIndex={currentIndex}
                             onCloseAnswerSheet={(visible) => {
                                 answerSheetDispatch({
                                     type: ANSWER_SHEET_ACTION.CLOSE_ANSWER_SHEET,
                                     payload: {showAnswerSheet: visible}
                                 })
                             }}
                             onPressQuestionOrder={(index, visible) => {
                                 answerSheetDispatch({
                                     type: ANSWER_SHEET_ACTION.ANSWER_SHEET_QUESTION_AVATAR_CLICKED,
                                     payload: {showAnswerSheet: visible}
                                 })
                                 setCurrentIndex(index)
                             }}/>
            </Box>
        </>
    );
}