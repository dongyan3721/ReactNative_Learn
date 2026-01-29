import { Slot } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {GestureHandlerRootView} from "react-native-gesture-handler";

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

export default function RootLayout() {
  return (
      <GestureHandlerRootView>
          <SafeAreaProvider>
              <AuthProvider>
    <GluestackUIProvider mode="dark">
      <Slot />
    </GluestackUIProvider>
    </AuthProvider>
          </SafeAreaProvider>
      </GestureHandlerRootView>
  );
}
