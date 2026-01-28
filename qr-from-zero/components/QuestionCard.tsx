import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Question } from '@/types';

interface Props {
    question: Question;
    onPress: () => void;
    showAnswer?: boolean;
}

const DIFFICULTY_COLORS = {
    Easy: '#4CAF50',
    Medium: '#FF9800',
    Hard: '#F44336',
};

export const QuestionCard: React.FC<Props> = ({
                                                  question,
                                                  onPress,
                                                  showAnswer = false,
                                              }) => {
    return (
        <TouchableOpacity
            style={styles.card}
    onPress={onPress}
    activeOpacity={0.9}
    >
    <View style={styles.header}>
    <View style={[
            styles.difficultyBadge,
    { backgroundColor: DIFFICULTY_COLORS[question.difficulty] }
]}>
    <Text style={styles.difficultyText}>{question.difficulty}</Text>
        </View>
    {question.isFavorited && (
        <Text style={styles.favoriteIcon}>★</Text>
    )}
    </View>

    <Text style={styles.title}>{question.title}</Text>

    {question.tags && question.tags.length > 0 && (
        <View style={styles.tagsContainer}>
            {question.tags.map((tag) => (
                    <View
                        key={tag.tagId}
                style={[
                        styles.tag,
        { backgroundColor: tag.tagColor || '#E0E0E0' }
    ]}
    >
        <Text style={styles.tagText}>{tag.tagName}</Text>
            </View>
    ))}
        </View>
    )}

    <View style={styles.footer}>
    <Text style={styles.viewCount}>浏览 {question.viewCount}</Text>
    <Text style={styles.hint}>
        {showAnswer ? '点击查看详情' : '点击查看答案'}
        </Text>
        </View>
        </TouchableOpacity>
);
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    difficultyBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    difficultyText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    favoriteIcon: {
        fontSize: 24,
        color: '#FFD700',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        lineHeight: 24,
        marginBottom: 12,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    tag: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        fontSize: 11,
        color: '#fff',
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    viewCount: {
        fontSize: 12,
        color: '#999',
    },
    hint: {
        fontSize: 12,
        color: '#007AFF',
        fontWeight: '500',
    },
});