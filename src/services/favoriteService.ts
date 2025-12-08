import { supabase } from './supabase';
import { Favorite } from '../types';

export const favoriteService = {
  // Get user's favorites
  async getUserFavorites(userId: string): Promise<Favorite[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        workshop:workshops(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Check if workshop is favorited
  async isFavorited(userId: string, workshopId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('workshop_id', workshopId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  },

  // Add to favorites
  async addFavorite(userId: string, workshopId: string): Promise<Favorite> {
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        workshop_id: workshopId,
      })
      .select(`
        *,
        workshop:workshops(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Remove from favorites
  async removeFavorite(userId: string, workshopId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('workshop_id', workshopId);

    if (error) throw error;
  },

  // Toggle favorite
  async toggleFavorite(userId: string, workshopId: string): Promise<boolean> {
    const isFav = await this.isFavorited(userId, workshopId);

    if (isFav) {
      await this.removeFavorite(userId, workshopId);
      return false;
    } else {
      await this.addFavorite(userId, workshopId);
      return true;
    }
  },
};
