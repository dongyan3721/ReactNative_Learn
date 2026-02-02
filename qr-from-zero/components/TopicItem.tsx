import React from 'react';
import { ExamTopic } from '@/types';
import { Pressable } from '@/components/ui/pressable';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Center } from '@/components/ui/center';

interface Props {
    topic: ExamTopic;
    onPress: () => void;
}

export const TopicItem: React.FC<Props> = ({ topic, onPress }) => {
    return (
        <Pressable
            onPress={onPress}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 mx-4 shadow-sm active:bg-gray-50 dark:active:bg-gray-700"
        >
            <HStack space="md" className="items-center">
                <VStack className="flex-1">
                    <Heading size="sm" className="text-gray-900 dark:text-gray-100 mb-1">
                        {topic.topicName}
                    </Heading>
                    {topic.description && (
                        <Text size="sm" className="text-gray-500 dark:text-gray-400" numberOfLines={2}>
                            {topic.description}
                        </Text>
                    )}
                </VStack>

                <HStack space="sm" className="items-center">
                    <Center className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1">
                        <Text className="text-lg font-bold text-primary-600 dark:text-primary-400">
                            {topic.questionCount || 0}
                        </Text>
                        <Text className="text-xs text-gray-500 dark:text-gray-400 -mt-1">题</Text>
                    </Center>
                    <Text className="text-2xl text-gray-300 dark:text-gray-600 font-light">›</Text>
                </HStack>
            </HStack>
        </Pressable>
    );
};