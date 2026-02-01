import React from 'react';
import { Question } from '@/types';
import { Pressable } from '@/components/ui/pressable';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Heading } from '@/components/ui/heading';

interface Props {
    question: Question;
    onPress: () => void;
    showAnswer?: boolean;
}

const difficultyMap = {
    Easy: 'success',
    Medium: 'warning',
    Hard: 'error',
} as const;

export const QuestionCard: React.FC<Props> = ({
    question,
    onPress,
    showAnswer = false,
}) => {
    return (
        <Pressable
            onPress={onPress}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm active:bg-gray-50 dark:active:bg-gray-700"
        >
            <VStack space="md">
                <HStack className="justify-between items-center">
                    <Badge size="sm" variant="solid" action={difficultyMap[question.difficulty] || 'muted'}>
                        <BadgeText>{question.difficulty}</BadgeText>
                    </Badge>
                    {question.isFavorited && (
                        <Text className="text-2xl text-yellow-400">★</Text>
                    )}
                </HStack>

                <Heading size="sm" className="text-gray-900 dark:text-gray-100 leading-normal">
                    {question.title}
                </Heading>

                {question.tags && question.tags.length > 0 && (
                    <HStack space="sm" className="flex-wrap">
                        {question.tags.map((tag) => (
                            <Badge key={tag.tagId} size="sm" action="muted" variant="solid" className="mb-1" style={{ backgroundColor: tag.tagColor || '#E0E0E0' }}>
                                <BadgeText>{tag.tagName}</BadgeText>
                            </Badge>
                        ))}
                    </HStack>
                )}

                <HStack className="justify-between items-center mt-2">
                    <Text size="xs" className="text-gray-500 dark:text-gray-400">
                        浏览 {question.viewCount}
                    </Text>
                    <Text size="xs" className="text-primary-600 dark:text-primary-400 font-medium">
                        {showAnswer ? '点击查看详情' : '点击查看答案'}
                    </Text>
                </HStack>
            </VStack>
        </Pressable>
    );
};