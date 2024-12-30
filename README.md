# Welcome to your Expo app 👋 Real Estate App

A comprehensive React Native application for real estate listings, featuring Google authentication, property management, and user profiles.

## 🌟 Overview

Built with Expo SDK 52, this app demonstrates modern mobile development practices using TypeScript, Appwrite, and Tailwind CSS

## ⚙️ Technology Stack

- Expo
- React Native
- TypeScript
- Nativewind
- Appwrite
- Tailwind CSS

## 🔋 Key Features

- Google Authentication
- Dynamic property listings with search and filters
- Comprehensive property details
- User profiles and settings
- Custom data fetching solution
- Code architecture optimized for reusability

## 🚀 Getting Started

### Prerequisites

- Git
- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/MauricioRaulFerreyra/react_native_restate.git
cd react_native_restate
```

2.Install dependencies:

```bash
npm install
```

1. Configure environment variables:

Create `.env.local` file:

```bash
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=
EXPO_PUBLIC_APPWRITE_DATABASE_ID=
EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID=
EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID=
EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID=
EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID=
```

4.Launch the app:

```bash
npx expo start
```

Run the app on:

- Development build
- Android emulator
- iOS simulator
- Expo Go

## 📖 Documentation

The app uses file-based routing within the `app` directory.

### Important Files

- `lib/data.ts`: Data management
- `lib/seed.ts`: Database seeding
- `lib/useAppwrite.ts`: Appwrite integration
