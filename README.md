# ገበጣ Gebeta - Ethiopian Mancala Game

A beautiful, interactive implementation of the traditional Ethiopian Mancala game built with React, TypeScript, and Tailwind CSS.

## 🎮 About the Game

Gebeta (ገበጣ) is a traditional Ethiopian board game similar to Mancala. Players take turns sowing seeds counterclockwise, capturing opponent's seeds by landing in empty holes on their side.

## ✨ Features

- 🎨 Beautiful Ethiopian-inspired design with coffee brown and gold color palette
- 🎯 Interactive gameplay with smooth animations
- 📱 Responsive design that works on all devices
- 🎪 Visual seed representation with animated elements
- 🏆 Winner detection and score tracking
- 🔄 Game reset functionality
- 💡 AI-powered hint system with Python backend
- 🎨 Clean, modern UI using shadcn/ui components

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Python 3.7 or higher (for hint backend)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gebeta-digital-soiree
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

4. Start the Python backend (in one terminal):
```bash
cd backend
python main.py
```

5. Start the frontend development server (in another terminal):
```bash
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

### Backend Setup

The hint system requires a Python backend to be running. The backend provides AI-powered move suggestions.

**Backend Features:**
- Simple move suggestion algorithm (chooses hole with most seeds)
- Advanced algorithm considering potential captures
- RESTful API with CORS support
- Health check endpoint

**Backend Endpoints:**
- `POST /suggest-move` - Get move suggestion
- `GET /health` - Health check

**Backend Configuration:**
- Runs on `http://localhost:8000`
- CORS enabled for frontend communication
- Debug mode enabled for development

## 🎯 How to Play

1. **Setup**: Each player starts with 6 holes containing 4 seeds each
2. **Gameplay**: Click on any hole on your side to sow seeds counterclockwise
3. **Capture**: Land your last seed in an empty hole on your side to capture opponent's seeds
4. **Hint System**: Click the "Hint" button to get AI-powered move suggestions (requires backend)
5. **Objective**: Collect more seeds than your opponent when the game ends

## 🛠️ Technologies Used

**Frontend:**
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components
- **Lucide React** - Modern icon library
- **Vite** - Fast build tool and dev server

**Backend:**
- **Python 3.7+** - Backend runtime
- **Flask** - Lightweight web framework
- **Flask-CORS** - Cross-origin resource sharing

## 🏗️ Project Structure

```
├── src/
│   ├── components/
│   │   ├── GameBoard.tsx     # Main game logic and state management
│   │   ├── Hole.tsx         # Individual game hole component
│   │   ├── PlayerInfo.tsx   # Player score and turn indicator
│   │   ├── GameControls.tsx # Game controls and winner display
│   │   └── ui/              # shadcn/ui components
│   ├── pages/
│   │   ├── Index.tsx        # Main game page
│   │   └── NotFound.tsx     # 404 page
│   ├── lib/
│   │   └── utils.ts         # Utility functions and API client
│   └── main.tsx             # App entry point
├── backend/
│   ├── main.py              # Flask backend server
│   └── requirements.txt     # Python dependencies
└── README.md
```

## 🎨 Design System

The game features an Ethiopian-inspired color palette:
- Rich coffee browns and golds
- Warm, earthy tones
- Smooth gradients and shadows
- Responsive, accessible design

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🚀 Deployment

The app can be deployed to any static hosting service:

```bash
npm run build
```

Upload the `dist` folder to your hosting provider.

### Lovable Deployment

Simply open [Lovable](https://lovable.dev/projects/01a5a508-5807-4b88-b138-f7edc3ef02c4) and click on Share → Publish.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
