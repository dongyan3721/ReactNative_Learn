import { Slot } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {GestureHandlerRootView} from "react-native-gesture-handler";

export default function RootLayout() {
  return (
      <GestureHandlerRootView>
          <SafeAreaProvider>
              <AuthProvider>
                  <Slot />
              </AuthProvider>
          </SafeAreaProvider>
      </GestureHandlerRootView>
  );
}
