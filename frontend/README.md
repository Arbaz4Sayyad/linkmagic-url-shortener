# URL Shortener Frontend

A modern React application for the URL Shortener service built with Vite and Tailwind CSS.

## Tech Stack

- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout wrapper
│   ├── Header.jsx      # Navigation header
│   └── Footer.jsx      # Footer component
├── pages/              # Page components
│   └── HomePage.jsx   # Home page
├── services/           # API services
│   └── api.js         # Axios configuration and API methods
├── App.jsx             # Main App component with routing
└── index.css           # Global styles with Tailwind
```

## Features

- ✅ Modern React with hooks
- ✅ Tailwind CSS for styling
- ✅ React Router for navigation
- ✅ Axios for API communication
- ✅ Responsive design
- ✅ Component-based architecture
- ✅ Environment configuration

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend is configured to connect to the backend API. API methods are available in `src/services/api.js`:

- `urlService.createShortUrl()` - Create short URLs
- `urlService.getUrlStats()` - Get URL statistics
- `urlService.getUrlInfo()` - Get URL information
- `urlService.deleteUrl()` - Delete URLs
- `urlService.healthCheck()` - Health check

## Styling

The application uses Tailwind CSS for styling. Configuration is in `tailwind.config.js` and `postcss.config.js`.

## Next Steps

- Implement URL shortening functionality
- Add analytics dashboard
- Create URL management interface
- Add error handling and loading states
- Implement form validation
