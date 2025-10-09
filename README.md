# Trendboard

A modern, real-time financial news dashboard built with React that aggregates and visualizes financial market data with AI-enhanced insights.

## Overview

Trendboard is a comprehensive financial news and analytics platform that provides real-time market updates, intelligent categorization, and data visualization tools. The application features a modern dark theme interface with smooth animations and responsive design, making financial data consumption both informative and engaging.

## Features

### Core Functionality
- **Real-time News Aggregation**: Fetches latest financial news from multiple sources including Finnhub API
- **AI-Enhanced Summaries**: Intelligent article summarization and analysis
- **Advanced Filtering**: Filter articles by category, search terms, and companies
- **Data Visualization**: Interactive charts and analytics dashboard
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### User Interface
- **Dark Theme**: Professional dark mode interface with warm color accents
- **Smooth Animations**: Framer Motion powered transitions and interactions
- **Grid/List Views**: Multiple viewing modes for article display
- **Real-time Updates**: Live timestamp updates and refresh indicators
- **Category System**: Color-coded categorization for easy navigation

## Technology Stack

### Frontend
- **React 19.1.1**: Modern React with latest features
- **Vite 7.1.2**: Fast build tool and development server
- **Tailwind CSS 3.4.18**: Utility-first CSS framework
- **Framer Motion 12.23.22**: Animation and gesture library

### Data Visualization
- **Recharts 3.2.1**: Composable charting library for React
- **Lucide React 0.545.0**: Modern icon library

### Backend Services
- **Firebase 12.3.0**: Cloud database and authentication
- **Finnhub API**: Financial market data provider
- **Google Gemini API**: AI-powered content analysis and summarization

## Installation

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- Firebase account and project setup
- Finnhub API key
- Google Gemini API key

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/piyushtyagiofficial/trendboard.git
   cd trendboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   VITE_FINNHUB_API_KEY=your_finnhub_api_key
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Firebase Setup**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Firestore Database
   - Configure authentication (if required)
   - Add your web app configuration to the `.env` file

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Usage

### Development Mode
```bash
npm run dev
```
Starts the development server at `http://localhost:5173`

### Production Build
```bash
npm run build
```
Creates an optimized production build in the `dist` folder

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing

## API Integration

### Finnhub API
The application integrates with Finnhub for real-time financial data:
- Market news and analysis
- Company-specific updates
- Stock symbols and financial instruments
- Rate-limited requests with intelligent queuing

### Google Gemini API
The application uses Google's Gemini AI for intelligent content processing:
- Article summarization and analysis
- Content categorization and insights
- Natural language processing for enhanced user experience
- AI-powered content recommendations

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add feature description'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is licensed under the MIT License. See the LICENSE file for details.
