// @ts-ignore
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { questionApi } from '@/api/question';
import { QuestionCard } from '@/components/QuestionCard';
import { Question } from '@/types';

export default function FavoritesScreen() {
    const router = useRouter();
    const [favorites, setFavorites] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // 使用useFocusEffect在页面获得焦点时重新加载
    useFocusEffect(
        React.useCallback(() => {
            loadFavorites();
        }, [])
    );

    const loadFavorites = async () => {
        try {
            const response = await questionApi.getFavorites();
            setFavorites(response.data);
        } catch (error) {
            Alert.alert('错误', '加载收藏失败');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadFavorites();
    };

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <Text>加载中...</Text>
        </View>
    );
    }

    if (favorites.length === 0) {
        return (
            <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>还没有收藏题目</Text>
                <Text style={styles.emptySubtext}>在做题时点击星标即可收藏</Text>
            </View>
    );
    }

    return (
        <View style={styles.container}>
        <FlatList
            data={favorites}
    keyExtractor={(item) => item.questionId.toString()}
    contentContainerStyle={styles.listContent}
    refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
}
    ListHeaderComponent={
        <View style={styles.header}>
    <Text style={styles.headerText}>
        共收藏 {favorites.length} 道题目
    </Text>
    </View>
}
    renderItem={({ item }) => (
        <QuestionCard
            question={item}
    onPress={() =>
    router.push(`/question/${item.topicId}/0`)
}
    showAnswer
    />
)}
    />
    </View>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
    },
    listContent: {
        paddingVertical: 16,
    },
    header: {
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    headerText: {
        fontSize: 14,
        color: '#666',
    },
});