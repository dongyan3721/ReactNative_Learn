// @ts-ignore
import React, { useState, useEffect, useRef } from 'react';
import {
    ScrollView,
    Animated
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { questionApi } from '@/api/question';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { AnswerSheet } from '@/components/AnswerSheet';
import { Question, AnswerCardItem } from '@/types';
import {Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { Center } from "@/components/ui/center";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import {ChevronLeft, ChevronRight, Grid3x3, Star, X} from "lucide-react-native";
import { Box } from "@/components/ui/box";
import {Badge, BadgeText} from "@/components/ui/badge";
import {Heading} from "@/components/ui/heading";
import {Button, ButtonText} from "@/components/ui/button";
import {Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader} from "@/components/ui/modal";
import {Divider} from "@/components/ui/divider";

const DIFFICULTY_COLORS = {
    Easy: 'success',
    Medium: 'warning',
    Hard: 'error',
};

export default function QuestionDetailScreen() {
    const { topicId, index } = useLocalSearchParams<{
        topicId: string;
        index: string;
    }>();

    const router = useRouter();
    const toast = useToast();
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
                render: ({ id }) => (
                    <Toast nativeID={id} action="success" variant="solid">
                        <ToastTitle>{response.data.message}</ToastTitle>
                    </Toast>
                ),
            });
        } catch (error) {
            toast.show({
                placement: 'top',
                render: ({ id }) => (
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

    const panGesture = Gesture.Pan().onEnd((event) => {
        if (event.translationX > 100) {
            handlePrevious();
        } else if (event.translationX < -100) {
            handleNext();
        }
    });

    if (isLoading) {
        return (
            <Center className="flex-1 bg-white dark:bg-gray-900">
                <Spinner size="large" />
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
                            <Pressable onPress={() => setShowAnswerSheet(true)}>
                                <Grid3x3 size={24} color="#6B7280" />
                            </Pressable>
                        </HStack>
                    ),
                }}
            />

            <Box className="flex-1 bg-white dark:bg-gray-900">
                <GestureDetector gesture={panGesture}>
                    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                        <ScrollView
                            ref={scrollViewRef}
                            contentContainerStyle={{ paddingBottom: 80 }}
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
                                <Box className="bg-white dark:bg-gray-900 p-4 mb-2">
                                    <MarkdownViewer content={currentQuestion.contentMd} />

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
                                    <Box className="p-4">
                                        <MarkdownViewer content={currentQuestion.answerMd} />
                                    </Box>
                                </Box>
                            )}
                        </ScrollView>
                    </Animated.View>
                </GestureDetector>

                {/* 底部导航栏 */}
                <Box className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t-2 border-t-gray-800 dark:border-t-gray-200 p-4 pb-6">
                    <HStack space="md">
                        <Button
                            className="flex-1 bg-orange-400 dark:bg-orange-100"
                            variant="outline"
                            onPress={handlePrevious}
                            isDisabled={currentIndex === 0}
                        >
                            <HStack space="xs" className="items-center">
                                <ChevronLeft size={20} />
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
                                <ChevronRight size={20} />
                            </HStack>
                        </Button>
                    </HStack>
                </Box>

                {/* 答题卡弹窗 */}
                <Modal isOpen={showAnswerSheet} onClose={() => setShowAnswerSheet(false)}>
                    <ModalBackdrop />
                    <ModalContent className="max-h-full">
                        <ModalHeader>
                            <Heading size="lg">答题卡</Heading>
                            <ModalCloseButton>
                                <X size={24} />
                            </ModalCloseButton>
                        </ModalHeader>
                        <ModalBody>
                            <HStack className="flex-wrap gap-2 p-2">
                                {answerCard.map((item, idx) => (
                                    <Pressable
                                        key={item.questionId}
                                        onPress={() => {
                                            setCurrentIndex(idx);
                                            setShowAnswerSheet(false);
                                        }}
                                    >
                                        <Box className="w-12 h-12 rounded justify-center items-center"
                                             style={{
                                                 backgroundColor: idx === currentIndex ? '#1A56DB' : item.isViewed ? '#86EFAC' : '#9CA3AF'
                                             }}
                                        >
                                            <Text className="font-bold"
                                                  style={{
                                                      backgroundColor: idx === currentIndex ? '#FFFFFF' : '#374151',
                                                  }}
                                            >
                                                {idx + 1}
                                            </Text>
                                        </Box>
                                    </Pressable>
                                ))}
                            </HStack>

                            <Divider className="my-4" />

                            <HStack className="justify-center mb-4">
                                <HStack className="items-center" space="xs">
                                    <Box className="w-4 h-4 rounded-s bg-green-300"/>
                                    <Text size="sm">已浏览</Text>
                                </HStack>
                                <HStack space="xs" className="items-center">
                                    <Box className="w-4 h-4 rounded-s bg-gray-700"/>
                                    <Text size="sm">当前题</Text>
                                </HStack>
                                <HStack space="xs" className="items-center">
                                    <Box className="w-4 h-4 rounded-s bg-orange-200"/>
                                    <Text size="sm">未浏览</Text>
                                </HStack>
                            </HStack>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Box>
        </>
    );
}