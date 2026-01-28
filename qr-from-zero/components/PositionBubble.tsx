import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
} from 'react-native';
import { Position } from '@/types';

interface Props {
    position: Position;
    onPress: () => void;
}

const COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
];

export const PositionBubble: React.FC<Props> = ({ position, onPress }) => {
    const backgroundColor = COLORS[position.positionId % COLORS.length];

    return (
        <TouchableOpacity
            style={[styles.bubble, { backgroundColor }]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Text style={styles.bubbleText} numberOfLines={2}>
                {position.positionName}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    bubble: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 24,
        margin: 8,
        minWidth: 100,
        maxWidth: 180,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    bubbleText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
    },
});