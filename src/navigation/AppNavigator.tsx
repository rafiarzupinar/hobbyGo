import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../utils/theme';

// Auth screens
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';

// Main screens
import { BottomTabNavigator } from './BottomTabNavigator';
import EventDetailScreen from '../screens/EventDetailScreen';
import WorkshopDetailScreen from '../screens/WorkshopDetailScreen';
import CreateEventScreen from '../screens/CreateEventScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  // TODO: Check authentication state
  const isAuthenticated = false;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.foreground,
          headerTitleStyle: {
            fontWeight: theme.fontWeight.bold,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen
              name="Onboarding"
              component={OnboardingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Main"
              component={BottomTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EventDetail"
              component={EventDetailScreen}
              options={{ title: 'Etkinlik Detayı' }}
            />
            <Stack.Screen
              name="WorkshopDetail"
              component={WorkshopDetailScreen}
              options={{ title: 'Atölye Detayı' }}
            />
            <Stack.Screen
              name="CreateEvent"
              component={CreateEventScreen}
              options={{ title: 'Yeni Etkinlik' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
