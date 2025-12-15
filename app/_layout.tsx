import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { View, ActivityIndicator } from 'react-native';
import 'react-native-reanimated';
import '@/locales/i18n';

import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { store } from '@/store';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setAuth, logout } from '@/store/slices/authSlice';
import { supabase } from '@/services/supabase';
import { authService } from '@/services/authService';
import { Colors } from '@/constants/theme';

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

  // Restore session on app start
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          // Get user profile from database
          try {
            const userProfile = await authService.getUserProfile(session.user.id);
            dispatch(setAuth({
              user: userProfile as any,
              session: session,
            }));
          } catch (profileError) {
            // If profile doesn't exist or can't be fetched, use basic user info
            console.log('Could not fetch profile, using basic info:', profileError);
            dispatch(setAuth({
              user: {
                id: session.user.id,
                email: session.user.email!,
                full_name: session.user.user_metadata?.full_name || session.user.email,
                user_type: 'user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              } as any,
              session: session,
            }));
          }
        }
      } catch (error) {
        console.error('Session restore error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            const userProfile = await authService.getUserProfile(session.user.id);
            dispatch(setAuth({
              user: userProfile as any,
              session: session,
            }));
          } catch (profileError) {
            // If profile doesn't exist or can't be fetched, use basic user info
            console.log('Could not fetch profile on sign in, using basic info');
            dispatch(setAuth({
              user: {
                id: session.user.id,
                email: session.user.email!,
                full_name: session.user.user_metadata?.full_name || session.user.email,
                user_type: 'user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              } as any,
              session: session,
            }));
          }
        } else if (event === 'SIGNED_OUT') {
          dispatch(logout());
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    if (isLoading) return;

    // TEMPORARILY DISABLED: Skip authentication for demo purposes
    // Users will be redirected directly to the main app
    const inAuthGroup = segments[0] === '(tabs)';
    const currentSegment = segments[0] as string;

    // Always redirect to main app on launch
    if (!inAuthGroup && currentSegment !== 'event' && currentSegment !== 'workshop' && currentSegment !== 'category' && currentSegment !== 'create-event' && currentSegment !== 'create-workshop') {
      router.replace('/(tabs)');
    }

    /* ORIGINAL AUTH CODE - COMMENTED OUT FOR DEMO
    if (!isAuthenticated && (inAuthGroup || inCreatePages)) {
      router.replace('/login');
    } else if (isAuthenticated && !inAuthGroup && currentSegment !== 'register' && currentSegment !== 'event' && currentSegment !== 'workshop' && !inCreatePages) {
      router.replace('/(tabs)');
    }
    */
  }, [segments, isLoading]);

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
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
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
