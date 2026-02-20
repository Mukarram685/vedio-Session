# Session Management & Live Video Integration

A production-ready healthcare session management interface with real-time video conferencing.

## 🚀 Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Ensure your `.env` file contains:
   ```env
   LIVEKIT_URL=wss://your-livekit-url
   LIVEKIT_API_KEY=your-api-key
   LIVEKIT_API_SECRET=your-api-secret
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🎨 Design Decisions

- **Color Palette**: Adhered strictly to Primary Purple (#A11692) for high-impact actions and Soft White/Grey for healthcare aesthetics.
- **Components**: Used a "pill-shape" design language (9999px radius) for all buttons and interactive elements.
- **AI Sidebar**: Implemented a dedicated "Companion" panel for mentors, utilizing subtle gradients and micro-animations for real-time insights.

## ♿ Accessibility (WCAG 2.1 AA)

- **Keyboard Navigation**: Full tab support with focus trapping in all modals.
- **Screen Readers**: ARIA labels on all video controls (Mute, Stop Video, End).
- **Contrast**: Main text meets 4.5:1 ratio; UI components meet 3:1.
- **Touch Targets**: All interactive elements are minimum 44px for tablet/mobile use.

## 🛠️ Tech Stack
- **Next.js 14** (App Router)
- **LiveKit Client** (Real-time WebRTC)
- **Zustand** (Global Session Management)
- **Tailwind CSS v4** (Brand Tokens)
