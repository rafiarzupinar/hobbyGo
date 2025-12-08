import { supabase } from './supabase';
import { User } from '../types';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

export const authService = {
  // Register with email and password (for RegisterScreen compatibility)
  async register({ name, email, password }: { name: string; email: string; password: string }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        return {
          success: false,
          error: 'E-posta adresinizi doğrulamanız gerekiyor. Lütfen gelen kutunuzu kontrol edin.',
          requiresEmailConfirmation: true
        };
      }

      // User profile is automatically created by database trigger
      // Wait a moment for trigger to complete, then fetch the profile
      if (data.user && data.session) {
        // Small delay to ensure trigger has completed
        await new Promise(resolve => setTimeout(resolve, 500));

        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          // Even if profile fetch fails, we can still return basic user info
          return {
            success: true,
            data: {
              user: {
                id: data.user.id,
                email: data.user.email,
                full_name: name,
                user_type: 'user'
              },
              session: data.session,
            },
          };
        }

        return {
          success: true,
          data: {
            user: profileData,
            session: data.session,
          },
        };
      }

      return {
        success: false,
        error: 'Kayıt tamamlanamadı. Lütfen tekrar deneyin.',
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Login with email and password (for LoginScreen compatibility)
  async login({ email, password }: { email: string; password: string }) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        data: {
          user: data.user ? {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.full_name || data.user.email,
          } : null,
          session: data.session,
        },
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Sign up with email and password (original)
  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: fullName,
          user_type: 'user',
        });

      if (profileError) throw profileError;
    }

    return data;
  },

  // Sign in with email and password (original)
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Alias for signOut (backward compatibility)
  async logout() {
    return this.signOut();
  },

  // Google OAuth
  async signInWithGoogle() {
    try {
      const redirectUri = makeRedirectUri({ scheme: 'atolyekesif' });
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
        if (result.type === 'success') {
          return { success: true, url: result.url };
        }
      }

      return { success: false, error: 'Google sign-in cancelled' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Apple OAuth
  async signInWithApple() {
    try {
      const redirectUri = makeRedirectUri({ scheme: 'atolyekesif' });
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
        if (result.type === 'success') {
          return { success: true, url: result.url };
        }
      }

      return { success: false, error: 'Apple sign-in cancelled' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Handle OAuth callback
  async handleOAuthCallback(url: string) {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.session) {
        return {
          success: true,
          data: {
            user: {
              id: data.session.user.id,
              email: data.session.user.email,
              name: data.session.user.user_metadata?.full_name || data.session.user.email,
            },
            session: data.session,
          },
        };
      }

      return { success: false, error: 'No session found' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Get current session
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  // Get current user
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  // Get user profile
  async getUserProfile(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Reset password
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  // Update password
  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  },
};
