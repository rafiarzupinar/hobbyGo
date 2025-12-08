import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './en/translation.json';
import tr from './tr/translation.json';

const LANGUAGE_STORAGE_KEY = '@app_language';

const resources = {
  en: { translation: en },
  tr: { translation: tr },
};

const initI18n = async () => {
  let savedLanguage = 'en';

  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    try {
      // Use localStorage for web, AsyncStorage for native
      if (typeof localStorage !== 'undefined') {
        savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'en';
      } else {
        savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY) || 'en';
      }
    } catch (error) {
      console.log('Error loading saved language:', error);
    }
  }

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLanguage,
      fallbackLng: 'en',
      compatibilityJSON: 'v3',
      interpolation: {
        escapeValue: false,
      },
    });
};

export const changeLanguage = async (language: string) => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      } else {
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      }
    } catch (error) {
      console.log('Error saving language:', error);
    }
  }
  await i18n.changeLanguage(language);
};

// Only init in browser/client environments
if (typeof window !== 'undefined') {
  initI18n();
} else {
  // For SSR, just initialize with default language
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'en',
      fallbackLng: 'en',
      compatibilityJSON: 'v3',
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;
