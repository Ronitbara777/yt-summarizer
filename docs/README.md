# YT Summarizer (Full Stack MERN)

YT Summarizer is a modern, full-stack web application that allows users to paste a YouTube URL and instantly receive a structured, easy-to-read AI-generated summary of the video. 

Built for students, researchers, and professionals who don't have time to watch long videos, featuring a secure authentication system to keep your summaries private.

## Features

- **User Authentication**: Secure Login & Registration system using JWT and bcrypt.
- **Protected Routes**: React Router integration preventing unauthorized access to the summarizer tool.
- **Instant Summarization**: Paste a YouTube link and get a summary in seconds.
- **Structured Output**: Receives a 1-sentence TL;DR, a paragraph summary, and a bulleted list of key takeaways.
- **Manual Transcript Option**: If the video has no captions, you can paste your own text transcript manually.
- **Clean UI**: A beautiful, professional, and responsive user interface built with React, Tailwind CSS, and Lucide Icons.

## Tech Stack (MERN)

### Frontend
- **React.js (Vite)**
- **Tailwind CSS**
- **React Router DOM** (Navigation)
- **Context API** (State Management)
- **Lucide React** (Icons)

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose** (Database & Schemas)
- **JSON Web Tokens (JWT) & bcryptjs** (Auth & Security)
- **express-rate-limit** (API Protection)
- **Supadata API**: For reliable YouTube transcript extraction.
- **Google Gemini API** (Gemini 2.5 Flash): For fast text processing and high-quality summarization.

## Prerequisites

Before running this project, you will need:
- [Node.js](https://nodejs.org/) installed on your machine.
- A [MongoDB Cluster](https://www.mongodb.com/cloud/atlas) connection string.
- A [Supadata API Key](https://supadata.ai/) (for fetching YouTube transcripts).
- A [Google Gemini API Key](https://ai.google.dev/) (for AI summarization).

## Getting Started

Follow these steps to run the full-stack application locally.

### 1. Clone the repository

```bash
git clone <repository-url>
cd yt-summarizer
```

### 2. Backend Setup

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and add your keys:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   SUPADATA_API_KEY=your_supadata_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the backend server:
   ```bash
   npm run dev
   # or node index.js
   ```
   The server will run on `http://localhost:5000`.

### 3. Frontend Setup

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The React app will be available on `http://localhost:5173`. You will be immediately redirected to the Login page.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive a JWT token

### Summarizer (Protected Route)
- `POST /api/summarize` - Accepts a YouTube URL and returns an AI-generated summary. Requires `Authorization: Bearer <token>` in headers.

## License
MIT
