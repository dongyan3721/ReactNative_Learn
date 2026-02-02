import { Stack } from 'expo-router';
import {useSettings} from "@/contexts/SettingsContext";
import {useColorScheme} from "react-native";
import {useMemo} from "react";

export default function Layout() {

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
            headerStyle: {
                backgroundColor: isDark?'#111827':'#FFFFFF',
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 1,
                borderBottomColor: '#E5E7EB',
                height: 'auto',
            },
            headerTintColor: isDark?'#FFF':'#111827',
            headerTitleStyle: {
                fontWeight: '600',
                fontSize: 18,
            },
            headerTitleAlign: 'center'
        }
    }, [settings, systemColorScheme])

    return <Stack screenOptions={screenOptions}/>;
}