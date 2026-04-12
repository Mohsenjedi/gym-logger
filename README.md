# 🏋️‍♂️ Gym Logger

A minimal, mobile-first gym logging web app designed for speed and simplicity. Built with **Next.js 15** and **Firebase Firestore**, it allows you to log your workouts in seconds without any friction.

---

## 🚀 Features

- **⚡ Fast Logging**: Add exercises (movement, reps, weight) with minimal taps.
- **📱 Mobile-First Design**: Optimized for use on your phone at the gym.
- **📅 Workout History**: Browse your past sessions at a glance.
- **🔥 Lightweight**: No bulky features—just what you need to track your progress.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Database**: [Firebase Firestore](https://firebase.google.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 📊 Data Model

### Firestore Collection: `workouts`
```
workouts/{workoutId}
  ├── date: Timestamp
  ├── entries: [
  │     {
  │       movement: string      // e.g. "Bench Press"
  │       reps: number          // e.g. 8
  │       weight: number        // e.g. 80 (in kg)
  │     }
  │   ]
  └── createdAt: Timestamp
```

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+ 
- A Firebase Project

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Mohsenjedi/gym-logger.git
   cd gym-logger
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run development**:
   ```bash
   npm run dev
   ```

---

## 🏗️ Project Structure

- `src/app/`: App Router pages and layouts.
- `src/components/`: Reusable UI components.
- `src/lib/`: Firebase config & helpers.
- `src/types/`: TypeScript definitions.

---

## 📝 License

Open-source under the MIT License. Feel free to use and modify!

---

**Happy Lifting!** 💪
