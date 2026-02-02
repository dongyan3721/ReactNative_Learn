import { Tabs } from 'expo-router';
import {Home, Star, User} from "lucide-react-native";
import {useMemo} from "react";
import {useSettings} from "@/contexts/SettingsContext";
import {useColorScheme} from "react-native";

export default function TabsLayout() {


    const {settings} = useSettings();

    const systemColorScheme = useColorScheme();

    const resolvedTheme = (theme: string)=>{
        return theme === 'system'
            ? (systemColorScheme === 'dark' ? 'dark' : 'light')
            : settings.theme;
    }

    const screenOptions = useMemo(()=>{

        const isDark = resolvedTheme(settings.theme) == 'dark';

        return {
            headerShown: true,
            tabBarActiveTintColor: '#1C64F2',
            tabBarInactiveTintColor: '#9CA3AF',
            tabBarStyle: {
                backgroundColor: isDark?'#111827':'#FFFFFF',
                borderTopWidth: 1,
                borderTopColor: '#E5E7EB',
                height: 60,
                paddingBottom: 8,
                paddingTop: 8,
            },
            headerStyle: {
                backgroundColor: isDark?'#111827':'#FFFFFF',
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 1,
                borderBottomColor: '#E5E7EB',
                height: 80,
            },
            headerTintColor: isDark?'#FFF':'#111827',
            headerTitleStyle: {
                fontWeight: '600',
                fontSize: 18,
            },
            headerTitleAlign: 'center'
        }
    }, [settings, systemColorScheme])

    return (
        <Tabs
            screenOptions={screenOptions}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: '首页',
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="favorites"
                options={{
                    title: '收藏',
                    tabBarIcon: ({ color, size }) => <Star color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: '我的',
                    tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
                }}
            />
        </Tabs>
    );
}
