# Supabase OAuth Setup Guide

Complete guide to enable Google and Apple authentication in your app.

## 📋 Prerequisites

- Supabase project created
- Google Cloud Console account (for Google OAuth)
- Apple Developer account (for Apple OAuth)

## 🔵 Google OAuth Setup

### 1. Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google+ API**

4. **Create OAuth Credentials:**
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: **Web application**
   - Name: `Supabase Auth`
   - Authorized redirect URIs:
     ```
     https://[your-project-ref].supabase.co/auth/v1/callback
     ```
   - Click "Create"
   - **Copy Client ID and Client Secret**

5. **For Mobile (iOS/Android):**
   - Create another OAuth client ID
   - Application type: **iOS** (for iOS app)
   - Bundle ID: `com.yourcompany.yourapp`
   - Create another for **Android**
   - Package name: `com.yourcompany.yourapp`

### 2. Supabase Configuration

1. Go to your Supabase project
2. Navigate to **Authentication → Providers**
3. Enable **Google**
4. Enter:
   - **Client ID** (from Google Console)
   - **Client Secret** (from Google Console)
5. Click **Save**

### 3. Test URL

Your Supabase Google OAuth URL will be:
```
https://[your-project-ref].supabase.co/auth/v1/authorize?provider=google
```

## 🍎 Apple OAuth Setup

### 1. Apple Developer Console

1. Go to [Apple Developer](https://developer.apple.com)
2. Go to **Certificates, Identifiers & Profiles**
3. Click **Identifiers** → **+** (Create new)

4. **Create Service ID:**
   - Select **Services IDs**
   - Description: `Supabase Auth`
   - Identifier: `com.yourcompany.yourapp.auth`
   - Click **Continue** → **Register**

5. **Configure Service ID:**
   - Enable **Sign in with Apple**
   - Click **Configure**
   - Primary App ID: Select your app's bundle ID
   - Website URLs:
     - Domains: `[your-project-ref].supabase.co`
     - Return URLs: `https://[your-project-ref].supabase.co/auth/v1/callback`
   - Click **Save**

6. **Create Key:**
   - Go to **Keys** → **+** (Create new)
   - Key Name: `Supabase Auth Key`
   - Enable **Sign in with Apple**
   - Click **Configure** → Select Service ID
   - Click **Continue** → **Register**
   - **Download the .p8 key file** (one-time download!)
   - Note the **Key ID**

### 2. Supabase Configuration

1. Go to Supabase → **Authentication → Providers**
2. Enable **Apple**
3. Enter:
   - **Services ID** (from Apple Console)
   - **Key ID** (from Apple Console)
   - **Secret Key** (content of .p8 file)
   - **Team ID** (from Apple Developer account)
4. Click **Save**

## 📱 Mobile App Configuration

### Update app.json

```json
{
  "expo": {
    "scheme": "yourapp",
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp"
    },
    "android": {
      "package": "com.yourcompany.yourapp"
    }
  }
}
```

### Update .env

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_REDIRECT_URL=yourapp://
```

## 🧪 Testing

### Email/Password (Already Working)
1. Open app → Register
2. Fill form → Register
3. Auto login → Home screen ✅

### Google OAuth (After Setup)
1. Click "Continue with Google"
2. Browser opens → Select Google account
3. Approve permissions
4. Redirect back to app
5. Auto login → Home screen ✅

### Apple OAuth (After Setup)
1. Click "Continue with Apple"
2. Apple Sign In modal opens
3. Use Face ID/Touch ID
4. Approve
5. Redirect back to app
6. Auto login → Home screen ✅

## 🔐 Security Notes

**Row Level Security (RLS)**

After users sign up via OAuth, their data is automatically protected:

```sql
-- Create a users table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data
CREATE POLICY "Users can view own data"
ON public.users FOR SELECT
USING (auth.uid() = id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data"
ON public.users FOR UPDATE
USING (auth.uid() = id);
```

## 🎯 Next Steps

1. ✅ Enable Google OAuth in Supabase
2. ✅ Enable Apple OAuth in Supabase
3. ✅ Update app.json with correct bundle IDs
4. ✅ Test on real device (OAuth doesn't work well in simulators)
5. ✅ Set up database tables and RLS policies

## 📚 Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase OAuth Providers](https://supabase.com/docs/guides/auth/social-login)
- [Expo AuthSession](https://docs.expo.dev/versions/latest/sdk/auth-session/)

## 💡 Current Status

✅ **Email/Password** - Fully working
🔧 **Google OAuth** - Configured in code, needs Supabase setup
🔧 **Apple OAuth** - Configured in code, needs Supabase setup
✅ **Biometric** - Fully working (Face ID, Touch ID)

Once you complete the Supabase OAuth configuration, the Google and Apple buttons will work automatically!
