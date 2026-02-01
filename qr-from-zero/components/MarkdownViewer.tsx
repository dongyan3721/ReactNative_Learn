import React from 'react';
import { ScrollView, useColorScheme } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';

interface Props {
    content: string;
}

const renderers = {
    // @ts-ignore
    heading1: ({ children }) => <Heading size="2xl" className="mt-6 mb-4 text-gray-900 dark:text-gray-100">{children}</Heading>,
    heading2: ({ children }) => <Heading size="xl" className="mt-5 mb-3 text-gray-900 dark:text-gray-100">{children}</Heading>,
    heading3: ({ children }) => <Heading size="lg" className="mt-4 mb-2 text-gray-900 dark:text-gray-100">{children}</Heading>,
    blockquote: ({ children }) => (
        <Box className="my-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 border-l-4 border-primary-500">
            {children}
        </Box>
    ),
    code_inline: ({ children }) => (
        <Text className="font-mono text-sm bg-gray-200 dark:bg-gray-700 text-red-600 dark:text-red-400 px-1 py-0.5 rounded">
            {children}
        </Text>
    ),
    fence: ({ children }) => (
         <Box className="my-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
            <Text className="font-mono text-sm text-gray-800 dark:text-gray-200">{children}</Text>
        </Box>
    ),
    code_block: ({ children }) => (
        <Box className="my-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
            <Text className="font-mono text-sm text-gray-800 dark:text-gray-200">{children}</Text>
        </Box>
    ),
    list_item: ({ children }) => (
        <HStack space="sm" className="my-1">
            <Text className="text-gray-800 dark:text-gray-200">•</Text>
            <Box className="flex-1">{children}</Box>
        </HStack>
    ),
    // Use default renderers for other elements but apply base styles via the `style` prop
};

const markdownStyles = {
    body: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 26,
        color: '#374151', // Corresponds to dark:text-gray-200
        // A base color is needed. The custom renderers for other text elements will override this.
    },
    link: {
        color: '#2563EB', // Corresponds to text-primary-600
        textDecorationLine: 'underline',
    },
};

const markdownStylesDark = {
    ...markdownStyles,
    paragraph: {
        ...markdownStyles.paragraph,
        color: '#E5E7EB',
    },
    link: {
        color: '#60A5FA', // Corresponds to dark:text-primary-400
        textDecorationLine: 'underline',
    },
};

export const MarkdownViewer: React.FC<Props> = ({ content }) => {
    const colorScheme = useColorScheme();
    const styles = colorScheme === 'dark' ? markdownStylesDark : markdownStyles;

    // The main text color is handled by the paragraph style.
    // The background is handled by the wrapping ScrollView.
    return (
        <ScrollView className="flex-1 bg-white dark:bg-gray-900">
            <Markdown style={styles} rules={renderers}>
                {content}
            </Markdown>
        </ScrollView>
    );
};