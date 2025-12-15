# Supabase Database Schema

## Overview
Complete database schema for Atölye Keşif platform using Supabase PostgreSQL.

## Tables

### 1. users
Extended user profile table (linked to Supabase Auth)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('user', 'workshop_owner')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE USING (auth.uid() = id);
```

### 2. categories
Workshop and event categories

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT USING (true);
```

### 3. subcategories
Subcategories for organizing events within categories

```sql
CREATE TABLE subcategories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_category_subcategory UNIQUE(category_id, slug)
);

-- Enable RLS
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Subcategories are viewable by everyone"
  ON subcategories FOR SELECT USING (true);

-- Indexes
CREATE INDEX idx_subcategories_category ON subcategories(category_id);
CREATE INDEX idx_subcategories_slug ON subcategories(slug);
```

### 4. workshops
Workshop/Studio information

```sql
CREATE TABLE workshops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  image_url TEXT,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT,
  instagram TEXT,
  rating DECIMAL(2, 1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Workshops are viewable by everyone"
  ON workshops FOR SELECT USING (is_active = true);

CREATE POLICY "Workshop owners can manage their workshops"
  ON workshops FOR ALL USING (auth.uid() = owner_id);

-- Index for location queries
CREATE INDEX idx_workshops_location ON workshops USING GIST (
  ll_to_earth(latitude, longitude)
);
```

### 5. events
Workshop events and classes

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  capacity INTEGER NOT NULL,
  current_bookings INTEGER DEFAULT 0,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced', 'all')),
  requirements TEXT,
  materials_included BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_capacity CHECK (current_bookings <= capacity),
  CONSTRAINT valid_dates CHECK (end_date > start_date)
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT USING (is_active = true);

CREATE POLICY "Workshop owners can manage their events"
  ON events FOR ALL USING (
  workshop_id IN (
    SELECT id FROM workshops WHERE owner_id = auth.uid()
  )
);

-- Indexes
CREATE INDEX idx_events_workshop ON events(workshop_id);
CREATE INDEX idx_events_category ON events(category_id);
CREATE INDEX idx_events_subcategory ON events(subcategory_id);
CREATE INDEX idx_events_dates ON events(start_date, end_date);
```

### 6. event_bookings
User bookings for events

```sql
CREATE TABLE event_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  num_participants INTEGER DEFAULT 1 NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'cancelled', 'completed')
  ),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (
    payment_status IN ('unpaid', 'paid', 'refunded')
  ),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_event UNIQUE(event_id, user_id)
);

-- Enable RLS
ALTER TABLE event_bookings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own bookings"
  ON event_bookings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON event_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON event_bookings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Workshop owners can view their event bookings"
  ON event_bookings FOR SELECT USING (
  event_id IN (
    SELECT e.id FROM events e
    JOIN workshops w ON w.id = e.workshop_id
    WHERE w.owner_id = auth.uid()
  )
);

-- Indexes
CREATE INDEX idx_bookings_event ON event_bookings(event_id);
CREATE INDEX idx_bookings_user ON event_bookings(user_id);
```

### 7. favorites
User favorite workshops

```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_workshop_favorite UNIQUE(user_id, workshop_id)
);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their favorites"
  ON favorites FOR ALL USING (auth.uid() = user_id);

-- Index
CREATE INDEX idx_favorites_user ON favorites(user_id);
```

### 8. notifications
Push notifications and in-app alerts

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL CHECK (
    type IN ('event_reminder', 'booking_confirmed', 'new_event', 'workshop_update', 'general')
  ),
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications"
  ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Index
CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
```

### 9. reviews
Workshop reviews and ratings

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_workshop_review UNIQUE(user_id, workshop_id)
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for workshops they attended"
  ON reviews FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM event_bookings eb
    JOIN events e ON e.id = eb.event_id
    WHERE e.workshop_id = reviews.workshop_id
    AND eb.user_id = auth.uid()
    AND eb.status = 'completed'
  )
);

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- Index
CREATE INDEX idx_reviews_workshop ON reviews(workshop_id);
```

## Database Functions

### Update Workshop Rating
Automatically update workshop rating when new review is added

```sql
CREATE OR REPLACE FUNCTION update_workshop_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE workshops
  SET
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 1)
      FROM reviews
      WHERE workshop_id = NEW.workshop_id
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE workshop_id = NEW.workshop_id
    )
  WHERE id = NEW.workshop_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_workshop_rating
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_workshop_rating();
```

### Update Event Bookings Count
Automatically update event current_bookings when booking is made

```sql
CREATE OR REPLACE FUNCTION update_event_bookings()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
    UPDATE events
    SET current_bookings = current_bookings + NEW.num_participants
    WHERE id = NEW.event_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'confirmed' AND NEW.status = 'confirmed' THEN
      UPDATE events
      SET current_bookings = current_bookings + NEW.num_participants
      WHERE id = NEW.event_id;
    ELSIF OLD.status = 'confirmed' AND NEW.status = 'cancelled' THEN
      UPDATE events
      SET current_bookings = current_bookings - OLD.num_participants
      WHERE id = NEW.event_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_event_bookings
  AFTER INSERT OR UPDATE ON event_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_event_bookings();
```

### Update Timestamps
Generic function to update updated_at timestamp

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workshops_updated_at BEFORE UPDATE ON workshops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_bookings_updated_at BEFORE UPDATE ON event_bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Storage Buckets

### Workshop Images
```sql
-- Create bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('workshop-images', 'workshop-images', true);

-- Policy for uploading
CREATE POLICY "Workshop owners can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'workshop-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy for public access
CREATE POLICY "Workshop images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'workshop-images');
```

### Event Images
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true);

CREATE POLICY "Workshop owners can upload event images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'event-images' AND
    EXISTS (
      SELECT 1 FROM workshops
      WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Event images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-images');
```

### User Avatars
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Avatars are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');
```

## Realtime Subscriptions

Enable realtime for relevant tables:

```sql
-- Enable realtime for events (new events, capacity changes)
ALTER PUBLICATION supabase_realtime ADD TABLE events;

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Enable realtime for event_bookings (for workshop owners)
ALTER PUBLICATION supabase_realtime ADD TABLE event_bookings;
```
