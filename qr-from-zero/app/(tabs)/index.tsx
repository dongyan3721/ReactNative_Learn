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
import {useRouter, useSegments} from 'expo-router';
import { positionApi } from '@/api/position';
import { PositionBubble } from '@/components/PositionBubble';
import { Position } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const segments = useSegments();

  useEffect(() => {
    loadPositions();
  }, []);

  const loadPositions = async () => {
    try {
      const response = await positionApi.getCurrentUserPositions();
      setPositions(response.data);
    } catch (error) {
      if (segments[0] == '(tabs)') Alert.alert('错误', '加载职位列表失败');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPositions();
  };

  if (isLoading) {
    return (
        <View style={styles.centerContainer}>
          <Text>加载中...</Text>
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <Text style={styles.title}>选择职位方向</Text>
        <Text style={styles.subtitle}>点击进入相关考点</Text>

        <FlatList
            data={positions}
            keyExtractor={(item) => item.positionId.toString()}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
                <PositionBubble
                    position={item}
                    onPress={() => router.push(`/position/${item.positionId}`)}
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 20,
    marginHorizontal: 24,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginTop: 4,
    marginBottom: 20,
    marginHorizontal: 24,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});