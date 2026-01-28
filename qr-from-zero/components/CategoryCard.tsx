import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    Dimensions,
    View,
} from 'react-native';
import { JobCategory } from '@/types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

interface Props {
    category: JobCategory;
    onPress: () => void;
    isSelected?: boolean;
}

export const CategoryCard: React.FC<Props> = ({ category, onPress, isSelected }) => {
    return (
        <TouchableOpacity
            style={[styles.card, isSelected && styles.selectedCard]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.cardContent}>
                <Text style={styles.categoryName}>{category.categoryName}</Text>
                <Text style={styles.categoryCode}>{category.categoryCode}</Text>
                {category.description && (
                    <Text style={styles.description}>{category.description}</Text>
                )}
            </View>
            {isSelected && <View style={styles.selectedBadge} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedCard: {
        borderColor: '#007AFF',
        backgroundColor: '#F0F8FF',
    },
    cardContent: {
        alignItems: 'center',
    },
    categoryName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    categoryCode: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007AFF',
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
    selectedBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#007AFF',
    },
});