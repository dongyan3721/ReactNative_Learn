import {Slot} from 'expo-router';
import {AuthProvider} from '@/contexts/AuthContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from "react-native-gesture-handler";
// import * as SplashScreen from 'expo-splash-screen';
import {GluestackUIProvider} from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import {SettingsProvider} from "@/contexts/SettingsContext";
import {StatusBar} from "expo-status-bar";


// SplashScreen.preventAutoHideAsync()

export default function RootLayout() {


    return (
        <GestureHandlerRootView>
            <SafeAreaProvider>
                <SettingsProvider>
                    <AuthProvider>
                        <GluestackUIProvider>
                            <StatusBar style="auto" />
                            <Slot/>
                        </GluestackUIProvider>
                    </AuthProvider>
                </SettingsProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
