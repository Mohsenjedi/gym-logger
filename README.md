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
   Create a `.env.local` file in the root directory and add your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🏗️ Project Structure

- `src/app/`: The main application pages and layouts.
- `src/components/`: Reusable UI components like `WorkoutForm` and `WorkoutList`.
- `src/lib/`: Firebase configuration and helper functions.
- `src/types/`: TypeScript interfaces and types.

---

## 🛡️ Security Rules

Development rules are set to `allow read, write: if true`. Ensure you lock these down with Firebase Authentication before moving to a public production environment.

---

## 📝 License

This project is open-source. Feel free to fork it and make it your own!

---

**Happy Lifting!** 💪
