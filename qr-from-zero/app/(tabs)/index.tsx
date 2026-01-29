// @ts-ignore
import React, { useState, useEffect } from 'react';
import {
  RefreshControl, FlatList,
} from 'react-native';
import {useRouter} from 'expo-router';
import { positionApi } from '@/api/position';
import { PositionBubble } from '@/components/PositionBubble';
import { Position } from '@/types';
import {Toast, ToastTitle, useToast} from "@/components/ui/toast";
import {Center} from "@/components/ui/center";
import { Spinner } from "@/components/ui/spinner";
import {VStack} from "@/components/ui/vstack";
import {Pressable} from "@/components/ui/pressable";
import {Text} from "@/components/ui/text";
import {Box} from "@/components/ui/box";

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
];

export default function HomeScreen() {
  const router = useRouter();
  const toast = useToast();
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPositions();
  }, []);

  const loadPositions = async () => {
    try {
      const response = await positionApi.getCurrentUserPositions();
      setPositions(response.data);
    } catch (error) {
      toast.show({
        placement: 'top',
        render: ({ id }) => (
            <Toast nativeID={id} action="error" variant="solid">
              <ToastTitle>加载职位列表失败</ToastTitle>
            </Toast>
        ),
      });
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
        <Center className="bg-white dark:bg-gray-900 flex-1">
          <Spinner size="large" />
        </Center>
    );
  }

  return (
      <Box className="flex-1 bg-white dark:bg-gray-900" >
        <VStack className="px-1.5 pt-1.5" space="xs">
          {/*<Heading size="2xl" className="text-gray-900 dark:text-gray-300">*/}
          {/*  选择职位方向*/}
          {/*</Heading>*/}
          <Text size="md" className="text-gray-900 dark:text-gray-300">
            点击进入相关考点
          </Text>
        </VStack>

        <FlatList
            data={positions}
            numColumns={2}
            contentContainerStyle={{ padding: 16 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item, index }) => (
                <Pressable className="flex-1 m-4"
                    onPress={() => router.push(`/position/${item.positionId}`)}
                >
                  <Box style={{backgroundColor: COLORS[index % COLORS.length]}}
                      className="rounded-2xl p-5 min-h-32 justify-center items-center shadow-black shadow-md dark:shadow-white z-10"
                  >
                    <Text className="text-white text-lg font-bold text-center">
                      {item.positionName}
                    </Text>
                  </Box>
                </Pressable>
            )}
            keyExtractor={(item) => item.positionId.toString()}
        />
      </Box>
  );
}