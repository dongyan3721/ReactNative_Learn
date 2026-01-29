import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                // tabBarActiveTintColor: '#007AFF',
                // tabBarInactiveTintColor: '#999',
                // tabBarStyle: {
                //     backgroundColor: '#fff',
                //     borderTopWidth: 1,
                //     borderTopColor: '#e0e0e0',
                // },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: '首页',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: '个人中心',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
                }}
            />
            <Tabs.Screen
                name="favorites"
                options={{
                    title: '我的收藏',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>⭐</Text>,
                }}
            />
        </Tabs>
    );
}
