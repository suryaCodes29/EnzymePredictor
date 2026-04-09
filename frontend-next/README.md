# EnzymeAI - Next.js Frontend

A production-ready enzyme prediction dashboard built with Next.js, featuring Google OAuth authentication, real-time analytics, and 3D protein visualization.

## Features

- **Dark Theme with Glassmorphism**: Modern UI with transparent cards and blur effects
- **Google OAuth Integration**: Secure authentication with Google accounts
- **Real-time Analytics**: Live updating charts and stats
- **3D Protein Visualization**: Interactive Three.js models
- **Backend Integration**: Connected to Flask API for enzyme predictions
- **Responsive Design**: Works on all device sizes
- **Framer Motion Animations**: Smooth transitions and effects

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**

   Copy `.env.example` to `.env.local` and fill in your credentials:

   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-random-secret-key-here

   # Optional: Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # Backend API URL
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
   ```

3. **Start the Backend:**

   Make sure your Flask backend is running on port 5000:

   ```bash
   cd ../backend
   python app.py
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## Backend Integration

The frontend connects to the Flask backend API with the following endpoints:

- `GET /health` - Health check
- `GET /supported-wastes` - Get supported waste types
- `POST /predict-enzyme` - Enzyme prediction
- `POST /predict-decomposition` - Decomposition prediction
- `POST /user/login` - User authentication
- `POST /user/register` - User registration

## Authentication Pages

- **Login**: `/auth/login` - Sign in with Google or email/password
- **Register**: `/auth/register` - Create account with Google or email/password

## Project Structure

```
frontend-next/
├── app/
│   ├── api/auth/[...nextauth]/    # NextAuth API route
│   ├── auth/
│   │   ├── login/                 # Login page
│   │   └── register/              # Register page
│   ├── globals.css                # Global styles
│   ├── layout.js                  # Root layout
│   └── page.jsx                   # Dashboard page
├── components/
│   ├── AnimatedBackground.jsx     # Background animation
│   ├── GradientButton.jsx         # Styled button
│   ├── GraphSection.jsx           # Charts and 3D model
│   ├── Navbar.jsx                 # Navigation header
│   ├── PredictionPanel.jsx        # Prediction results
│   ├── Providers.jsx              # Session provider
│   ├── Sidebar.jsx                # Side navigation
│   ├── StatsCard.jsx              # Stats display
│   ├── ThreeDProtein.jsx          # 3D visualization
│   └── UploadPanel.jsx            # File upload
├── data/
│   └── dummyData.js               # Sample data
├── lib/
│   └── api.js                     # API client
└── package.json
```

## Technologies Used

- **Next.js 14** - React framework
- **NextAuth.js** - Authentication
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Three.js** - 3D graphics
- **Recharts** - Data visualization

## Development

### Running Both Frontend and Backend

1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   python app.py
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd frontend-next
   npm run dev
   ```

### API Integration

The frontend includes an API client (`lib/api.js`) that handles all backend communication. It includes error handling and supports all the backend endpoints.

## Deployment

1. Build for production:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

For deployment platforms like Vercel, make sure to set the environment variables in your deployment settings and update the `NEXT_PUBLIC_API_BASE_URL` to point to your deployed backend.