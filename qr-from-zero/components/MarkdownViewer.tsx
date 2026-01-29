import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';

interface Props {
    content: string;
}

export const MarkdownViewer: React.FC<Props> = ({ content }) => {
    return (
        <ScrollView style={styles.container}>
            <Markdown style={markdownStyles}>
                {content}
            </Markdown>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

const markdownStyles = {
    body: {
        padding: 16,
        fontSize: 15,
        lineHeight: 24,
        color: '#1a1a1a',
    },
    heading1: {
        fontSize: 24,
        fontWeight: '700',
        marginTop: 20,
        marginBottom: 12,
        color: '#1a1a1a',
    },
    heading2: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 10,
        color: '#1a1a1a',
    },
    heading3: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 8,
        color: '#1a1a1a',
    },
    code_inline: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        fontFamily: 'Courier',
        fontSize: 14,
        color: '#E53935',
    },
    code_block: {
        backgroundColor: '#F5F5F5',
        padding: 12,
        borderRadius: 8,
        fontFamily: 'Courier',
        fontSize: 13,
        marginVertical: 8,
    },
    fence: {
        backgroundColor: '#F5F5F5',
        padding: 12,
        borderRadius: 8,
        fontFamily: 'Courier',
        fontSize: 13,
        marginVertical: 8,
    },
    bullet_list: {
        marginVertical: 8,
    },
    ordered_list: {
        marginVertical: 8,
    },
    list_item: {
        marginVertical: 4,
    },
    blockquote: {
        backgroundColor: '#F0F8FF',
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginVertical: 8,
    },
    table: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        marginVertical: 8,
    },
    tr: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    th: {
        padding: 8,
        backgroundColor: '#F5F5F5',
        fontWeight: '600',
    },
    td: {
        padding: 8,
    },
};