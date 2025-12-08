import { supabase } from './supabase';
import { Workshop } from '../types';

export const workshopService = {
  // List all workshops
  async listWorkshops(limit = 20, offset = 0): Promise<Workshop[]> {
    const { data, error } = await supabase
      .from('workshops')
      .select('*')
      .eq('is_active', true)
      .order('rating', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  },

  // Get nearby workshops
  async getNearbyWorkshops(
    latitude: number,
    longitude: number,
    radiusKm = 10
  ): Promise<Workshop[]> {
    const { data, error } = await supabase.rpc('nearby_workshops', {
      lat: latitude,
      long: longitude,
      radius_km: radiusKm,
    });

    if (error) throw error;
    return data || [];
  },

  // Get workshop by ID
  async getWorkshop(workshopId: string): Promise<Workshop | null> {
    const { data, error } = await supabase
      .from('workshops')
      .select('*')
      .eq('id', workshopId)
      .single();

    if (error) throw error;
    return data;
  },

  // Get workshops by owner
  async getWorkshopsByOwner(ownerId: string): Promise<Workshop[]> {
    const { data, error } = await supabase
      .from('workshops')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create workshop
  async createWorkshop(workshop: Partial<Workshop>): Promise<Workshop> {
    const { data, error } = await supabase
      .from('workshops')
      .insert(workshop)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update workshop
  async updateWorkshop(workshopId: string, updates: Partial<Workshop>): Promise<Workshop> {
    const { data, error } = await supabase
      .from('workshops')
      .update(updates)
      .eq('id', workshopId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete workshop
  async deleteWorkshop(workshopId: string) {
    const { error } = await supabase
      .from('workshops')
      .update({ is_active: false })
      .eq('id', workshopId);

    if (error) throw error;
  },

  // Search workshops
  async searchWorkshops(query: string): Promise<Workshop[]> {
    const { data, error } = await supabase
      .from('workshops')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('is_active', true)
      .order('rating', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get workshop reviews
  async getWorkshopReviews(workshopId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user:users(id, full_name, avatar_url)
      `)
      .eq('workshop_id', workshopId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Add review
  async addReview(workshopId: string, userId: string, rating: number, comment?: string) {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        workshop_id: workshopId,
        user_id: userId,
        rating,
        comment,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
