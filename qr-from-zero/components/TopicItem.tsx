import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
} from 'react-native';
import { ExamTopic } from '@/types';

interface Props {
    topic: ExamTopic;
    onPress: () => void;
}

export const TopicItem: React.FC<Props> = ({ topic, onPress }) => {
    return (
        <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.content}>
    <Text style={styles.topicName}>{topic.topicName}</Text>
    {topic.description && (
        <Text style={styles.description} numberOfLines={2}>
        {topic.description}
        </Text>
    )}
    </View>
    <View style={styles.rightSection}>
    <View style={styles.countBadge}>
    <Text style={styles.countText}>{topic.questionCount || 0}</Text>
        <Text style={styles.countLabel}>题</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
    </View>
    </TouchableOpacity>
);
};

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
        alignItems: 'center',
    },
    content: {
        flex: 1,
        marginRight: 12,
    },
    topicName: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    countBadge: {
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: 8,
        alignItems: 'center',
    },
    countText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#007AFF',
    },
    countLabel: {
        fontSize: 11,
        color: '#666',
        marginTop: 2,
    },
    arrow: {
        fontSize: 28,
        color: '#ccc',
        fontWeight: '300',
    },
});