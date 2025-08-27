# OWID Predictor Frontend Setup

## Quick Start

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Features Included

### 🎨 **Modern UI/UX**
- **Glass Morphism Design** with backdrop blur effects
- **Framer Motion Animations** for smooth interactions
- **Responsive Grid Layout** that works on all devices
- **Custom Tailwind CSS** configuration with brand colors

### 🔮 **Advanced Animations**
- **Staggered Loading** animations for components
- **Interactive Hover Effects** with scale transforms
- **Floating Particle Background** with gradient animations
- **Custom Loading States** with progress indicators
- **Smooth Page Transitions** using AnimatePresence

### 📊 **Data Visualization**
- **Interactive Charts** using Recharts library
- **Real-time Metrics Display** with animated counters
- **Confidence Intervals** visualization
- **Color-coded Performance** indicators

### 🎛️ **Interactive Components**
- **Smart Country Selector** with search and recommendations
- **Advanced Model Selector** with performance comparisons
- **Dynamic Horizon Selection** with visual feedback
- **Error Handling** with user-friendly messages

### ⚡ **Performance Optimizations**
- **Lazy Loading** for heavy components
- **Memoized Calculations** to prevent unnecessary re-renders
- **Optimized Bundle Size** with tree shaking
- **Custom Loading Screens** with progress tracking

## Component Architecture

```
src/
├── components/           # Reusable UI components
│   ├── BackgroundElements.jsx    # Animated background
│   ├── CountrySelector.jsx       # Country selection dropdown
│   ├── LoadingSpinner.jsx        # Custom loading animations
│   ├── MetricsDisplay.jsx        # Model performance metrics
│   ├── ModelSelector.jsx         # ML model selection
│   └── PredictionChart.jsx       # Data visualization
├── hooks/               # Custom React hooks
│   └── useApi.js       # API integration hook
├── App.js              # Main application component
├── index.css           # Global styles and Tailwind
└── index.js            # Application entry point
```

## Design System

### Colors
- **Primary**: Blue gradient (#0ea5e9 → #8b5cf6)
- **Accent**: Purple (#8b5cf6)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Monospace**: JetBrains Mono
- **Font Weights**: 300, 400, 500, 600, 700, 800, 900

### Animations
- **Duration**: 300ms for interactions, 600ms for page loads
- **Easing**: Custom cubic-bezier curves
- **Stagger**: 100ms delay between child animations

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ IE 11 (limited support)

## Performance Targets

- 🎯 **First Contentful Paint**: < 1.5s
- 🎯 **Largest Contentful Paint**: < 2.5s
- 🎯 **Time to Interactive**: < 3.5s
- 🎯 **Cumulative Layout Shift**: < 0.1

## Accessibility

- ✅ **WCAG 2.1 AA** compliance
- ✅ **Keyboard Navigation** support
- ✅ **Screen Reader** optimization
- ✅ **High Contrast** mode support
- ✅ **Reduced Motion** respect

## Development Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Analyze bundle size
npm run build && npx serve -s build

# Check for security vulnerabilities
npm audit

# Update dependencies
npm update
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_VERSION=2.0.0
REACT_APP_ENVIRONMENT=development
```

## Deployment

### Vercel (Recommended)
```bash
npx vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npx", "serve", "-s", "build"]
```

## Troubleshooting

### Common Issues

1. **Tailwind styles not loading**
   - Ensure PostCSS config is correct
   - Check if Tailwind is imported in index.css

2. **Framer Motion animations not working**
   - Verify React version compatibility
   - Check for conflicting CSS animations

3. **API requests failing**
   - Ensure backend server is running on port 5000
   - Check CORS configuration

4. **Build errors**
   - Clear node_modules and reinstall
   - Check for conflicting dependencies