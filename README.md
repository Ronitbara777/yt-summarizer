# YT Summarizer

YT Summarizer is a modern web application that allows users to paste a YouTube URL and instantly receive a structured, easy-to-read AI-generated summary of the video. 

Built for students, researchers, and professionals who don't have time to watch long videos.

## Features

- **Instant Summarization**: Paste a YouTube link and get a summary in seconds.
- **Structured Output**: Receives a 1-sentence TL;DR, a paragraph summary, and a bulleted list of key takeaways.
- **Manual Transcript Option**: If the video has no captions, you can paste your own text transcript manually.
- **Copy to Clipboard**: Easily copy the generated summary with one click.
- **Clean UI**: A beautiful, modern, and responsive user interface built with React and Tailwind CSS.

## Tech Stack

### Frontend
- **React.js (Vite)**
- **Tailwind CSS**

### Backend
- **Node.js**
- **Express.js**
- **Supadata API**: For reliable YouTube transcript extraction.
- **Google Gemini API** (Gemini 2.5 Flash): For fast text processing and high-quality summarization.

## Prerequisites

Before running this project, you will need:
- [Node.js](https://nodejs.org/) installed on your machine.
- A [Supadata API Key](https://supadata.ai/) (for fetching YouTube transcripts).
- A [Google Gemini API Key](https://ai.google.dev/) (for AI summarization).

## Getting Started

Follow these steps to run the application locally.

### 1. Clone the repository

```bash
git clone <repository-url>
cd "yt-summarizer"
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
3. Create a `.env` file in the `server` directory and add your API keys:
   ```env
   PORT=5000
   SUPADATA_API_KEY=your_supadata_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Start the backend server:
   ```bash
   npm start
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
   The React app will be available on `http://localhost:5173`.

## System Architecture

The application follows a client-server architecture:
1. User submits a YouTube URL via the React frontend.
2. The frontend sends a `POST` request to the Express backend.
3. The backend fetches the transcript using the Supadata API.
4. The transcript is sent to the Google Gemini API to generate a structured JSON summary.
5. The backend returns the parsed summary back to the frontend to be displayed.

## API Endpoints

### `POST /api/summarize`
Accepts a YouTube URL and returns an AI-generated summary.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=...",
  "transcript": "" // Optional manual transcript
}
```

**Success Response (200 OK):**
```json
{
  "tldr": "...",
  "summary": "...",
  "takeaways": ["...", "..."]
}
```

## License
MIT
