import React from 'react';
import { JobCategory } from '@/types';
import { Pressable } from '@/components/ui/pressable';
import { Box } from '@/components/ui/box';
import { Heading, Text } from '@/components/ui/text';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Center } from '@/components/ui/center';

interface Props {
    category: JobCategory;
    onPress: () => void;
    isSelected?: boolean;
}

export const CategoryCard: React.FC<Props> = ({ category, onPress, isSelected }) => {
    return (
        <Pressable
            onPress={onPress}
            className={`
                w-full bg-white dark:bg-gray-800 
                rounded-2xl p-6 mb-4 
                border-2 
                ${isSelected ? 'border-primary-500 bg-primary-50 dark:bg-gray-700' : 'border-transparent dark:border-gray-700'}
                shadow-md
            `}
        >
            <Box>
                <Center>
                    <Heading size="xl" className="text-gray-900 dark:text-gray-100 mb-2">{category.categoryName}</Heading>
                    <Badge size="md" variant="solid" action="info" className="mb-3">
                        <BadgeText>{category.categoryCode}</BadgeText>
                    </Badge>
                    {category.description && (
                        <Text className="text-gray-600 dark:text-gray-400 text-center">
                            {category.description}
                        </Text>
                    )}
                </Center>
            </Box>
        </Pressable>
    );
};