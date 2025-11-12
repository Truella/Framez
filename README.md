# Framez - Social Media Mobile App

A modern social media application built with React Native and Expo, allowing users to share moments through posts with images and text.

## Features

- **User Authentication**: Secure email/password authentication using Supabase Auth
- **Create Posts**: Share text updates and photos with the community
- **Engage with Content**: Like and save posts from other users
- **User Profiles**: View your posts and saved content in one place
- **Real-time Feed**: Browse posts from all users with pull-to-refresh functionality
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing
- **Responsive Design**: Optimized for mobile devices with smooth animations

## Technology Stack

### Frontend
- **React Native** (0.81.5) - Cross-platform mobile framework
- **Expo** (~54.0.23) - Development platform for React Native
- **React Navigation** - Navigation library for tabs and stack navigation
- **TypeScript** - Type-safe development
- **Expo Linear Gradient** - Beautiful gradient UI elements
- **React Native Toast Message** - User-friendly notifications

### Backend
- **Supabase** - Backend-as-a-Service solution providing:
  - PostgreSQL database for data storage
  - Authentication service for user management
  - Storage service for image uploads
  - Row Level Security (RLS) for data protection

### Why Supabase?

Supabase was chosen as the backend for several key reasons:

1. **Real-time Capabilities**: Built-in real-time subscriptions for live updates
2. **Secure Authentication**: Industry-standard authentication with built-in session management
3. **Storage Solution**: Integrated file storage for user-uploaded images
4. **Row Level Security**: Database-level security policies to protect user data
5. **PostgreSQL**: Powerful relational database with full SQL support
6. **Developer Experience**: Easy-to-use SDK with excellent TypeScript support
7. **Scalability**: Handles growth from prototype to production seamlessly

## Database Schema

### Tables

#### profiles
Stores user profile information
- `id` (uuid, primary key) - Links to Supabase auth.users
- `username` (text, unique) - User's unique handle
- `full_name` (text) - User's display name
- `bio` (text, optional) - User biography
- `avatar_url` (text, optional) - Profile picture URL
- `created_at` (timestamp) - Account creation date

#### posts
Stores user posts
- `id` (uuid, primary key) - Unique post identifier
- `user_id` (uuid, foreign key) - References profiles.id
- `content` (text) - Post text content
- `image_url` (text, optional) - Uploaded image URL
- `created_at` (timestamp) - Post creation date

#### likes
Tracks post likes
- `id` (uuid, primary key) - Unique like identifier
- `user_id` (uuid, foreign key) - User who liked
- `post_id` (uuid, foreign key) - Post that was liked
- `created_at` (timestamp) - Like timestamp

#### saved_posts
Stores saved/bookmarked posts
- `id` (uuid, primary key) - Unique save identifier
- `user_id` (uuid, foreign key) - User who saved
- `post_id` (uuid, foreign key) - Post that was saved
- `created_at` (timestamp) - Save timestamp

### Security

All tables use Row Level Security (RLS) policies to ensure:
- Users can only modify their own data
- Public posts are visible to authenticated users
- Likes and saves are properly attributed to the correct user

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- A Supabase account (free tier available at [supabase.com](https://supabase.com))

### 1. Clone the Repository

```bash
git clone <repository-url>
cd framez
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy your Project URL and Anon Key
4. Create the database tables by running the migrations in the Supabase SQL Editor

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Configure Storage Bucket

1. Go to Supabase Dashboard > Storage
2. Create a new bucket named `post-images`
3. Set the bucket to "Public" for image access
4. Configure storage policies to allow authenticated users to upload

### 6. Start the Development Server

```bash
npx expo start
```

Or use the npm script:

```bash
npm start
```

### 7. Run on Device

- **Android**: Press `a` in the terminal or scan QR code with Expo Go app
- **iOS**: Press `i` in the terminal or scan QR code with Expo Go app (Mac only for simulator)
- **Web**: Press `w` in the terminal

## Project Structure

```
framez/
├── assets/              # Images and static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ConfirmDialog.tsx
│   │   ├── GradientButton.tsx
│   │   ├── PostCard.tsx
│   │   └── ThemeSwitcher.tsx
│   ├── context/         # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── PostsContext.tsx
│   │   └── ThemeContext.tsx
│   ├── navigation/      # Navigation setup
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MainNavigator.tsx
│   ├── screens/         # Screen components
│   │   ├── Auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── SignUpScreen.tsx
│   │   ├── Feed/
│   │   │   └── FeedScreen.tsx
│   │   ├── Post/
│   │   │   └── CreatePostScreen.tsx
│   │   └── Profile/
│   │       └── ProfileScreen.tsx
│   ├── services/        # API and business logic
│   │   ├── likes.ts
│   │   └── posts.ts
│   ├── theme/           # Styling and themes
│   │   └── colors.ts
│   ├── types/           # TypeScript types
│   │   ├── index.ts
│   │   └── navigation.ts
│   ├── utils/           # Helper functions
│   │   ├── inputHelpers.ts
│   │   └── toast.ts
│   └── config/          # App configuration
│       └── supabase.ts
├── App.tsx              # App entry point
├── app.config.js        # Expo configuration
└── package.json         # Dependencies
```

## Key Implementation Details

### Authentication Flow

- New users sign up with email, password, username, and full name
- Profiles are automatically created via Supabase database triggers
- Sessions are persisted using AsyncStorage
- Authentication state is managed globally via AuthContext

### Post Management

- Posts support both text-only and image+text formats
- Images are compressed before upload to optimize storage and bandwidth
- Images are stored in Supabase Storage with public URLs
- Post deletion automatically removes associated images from storage

### Like & Save System

- Optimistic UI updates for instant feedback
- Database queries handle race conditions
- Like counts are computed in real-time
- Saved posts are displayed in a separate profile tab

### State Management

- **AuthContext**: User authentication and session management
- **PostsContext**: Centralized post data with caching
- **ThemeContext**: Light/dark mode preferences persisted to AsyncStorage

### Theming

- Dynamic color system supporting light and dark modes
- Gradient accents throughout the UI
- Consistent design language across all screens

## Building for Production

### Android APK

```bash
eas build --platform android --profile preview
```

### iOS (requires Apple Developer account)

```bash
eas build --platform ios --profile production
```

### Configure EAS

First, install EAS CLI:

```bash
npm install -g eas-cli
```

Login and configure:

```bash
eas login
eas build:configure
```

## Troubleshooting

### Environment Variables Not Loading

Clear the Expo cache and restart:

```bash
npx expo start -c
```

### Supabase Connection Issues

Verify your credentials in `.env` and ensure the Supabase project is active.

### Image Upload Failures

Check that the `post-images` storage bucket exists and has correct permissions in Supabase Dashboard.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.
