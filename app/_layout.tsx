import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { View, ActivityIndicator, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-reanimated';
import '@/locales/i18n';

import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { store } from '@/store';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setAuth, logout } from '@/store/slices/authSlice';
import { supabase } from '@/services/supabase';
import { authService } from '@/services/authService';
import { Colors } from '@/constants/theme';

const USER_TYPE_KEY = '@hobbygo_user_type';

// Storage wrapper for web/native compatibility
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return AsyncStorage.getItem(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    return AsyncStorage.setItem(key, value);
  },
};

const queryClient = new QueryClient();

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const { theme, colors } = useTheme();
  const segments = useSegments();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);

  // Load user type from storage on app start
  useEffect(() => {
    const loadUserType = async () => {
      try {
        const savedUserType = await storage.getItem(USER_TYPE_KEY);
        setUserType(savedUserType);
      } catch (error) {
        console.error('Error loading user type:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserType();
  }, []);

  // Handle navigation based on user role selection
  useEffect(() => {
    if (isLoading) return;

    const currentSegment = segments[0] as string;
    const inTabs = currentSegment === '(tabs)';
    const inRoleSelection = currentSegment === 'role-selection';
    const inDetailPages = ['event', 'workshop', 'category', 'create-event', 'create-workshop'].includes(currentSegment);

    // If no user type selected, redirect to role selection
    if (!userType && !inRoleSelection && !inDetailPages) {
      router.replace('/role-selection');
    }
    // If user type selected but not in tabs, go to tabs
    else if (userType && !inTabs && !inRoleSelection && !inDetailPages) {
      router.replace('/(tabs)');
    }
  }, [segments, isLoading, userType]);

  // Show loading screen while restoring session
  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="role-selection" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="category/[slug]" options={{ presentation: 'card' }} />
        <Stack.Screen name="event/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="workshop/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="create-event" options={{ presentation: 'modal' }} />
        <Stack.Screen name="create-workshop" options={{ presentation: 'modal' }} />
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
