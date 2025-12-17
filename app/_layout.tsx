import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-native-reanimated';
import '@/locales/i18n';

import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { store } from '@/store';

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { theme, colors } = useTheme();

  return (
    <NavigationThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="role-selection" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="category/[slug]" options={{ presentation: 'card' }} />
        <Stack.Screen name="event/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="workshop/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="create-event" options={{ presentation: 'modal' }} />
        <Stack.Screen name="create-workshop" options={{ presentation: 'modal' }} />
        <Stack.Screen name="workshop-dashboard" options={{ presentation: 'card' }} />
        <Stack.Screen name="add-slot" options={{ presentation: 'modal' }} />
        <Stack.Screen name="workshop-stats" options={{ presentation: 'card' }} />
        <Stack.Screen name="workshop-settings" options={{ presentation: 'card' }} />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RootLayoutNav />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}
