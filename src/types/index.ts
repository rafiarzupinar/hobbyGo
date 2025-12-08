export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  user_type: 'user' | 'workshop_owner';
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description?: string;
  created_at: string;
  subcategories?: Subcategory[]; // Joined data
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface Workshop {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string;
  image_url?: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  rating: number;
  review_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  distance?: number; // Calculated field
}

export interface Event {
  id: string;
  workshop_id: string;
  category_id?: string;
  title: string;
  description: string;
  image_url?: string;
  start_date: string;
  end_date: string;
  price: number;
  original_price?: number;
  capacity: number;
  current_bookings: number;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'all';
  requirements?: string;
  materials_included: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  workshop?: Workshop; // Joined data
  category?: Category; // Joined data
}

export interface EventBooking {
  id: string;
  event_id: string;
  user_id: string;
  num_participants: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  notes?: string;
  created_at: string;
  updated_at: string;
  event?: Event; // Joined data
}

export interface Favorite {
  id: string;
  user_id: string;
  workshop_id: string;
  created_at: string;
  workshop?: Workshop; // Joined data
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: 'event_reminder' | 'booking_confirmed' | 'new_event' | 'workshop_update' | 'general';
  data?: any;
  is_read: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  workshop_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
  user?: User; // Joined data
}

export interface Location {
  latitude: number;
  longitude: number;
}
