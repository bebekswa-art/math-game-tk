# Deployment Guide

## Local Development

### Quick Start
```bash
# Open index.html directly in a browser
open index.html
# or
start index.html
```

### Local Server (Recommended)
For better cross-browser testing and to avoid CORS issues with audio/data files:

**Python 3:**
```bash
python -m http.server 8000
```
Then open http://localhost:8000

**Node.js (http-server):**
```bash
npx http-server -p 8000
```
Then open http://localhost:8000

**Live Server (VS Code):**
- Install "Live Server" extension
- Right-click index.html → "Open with Live Server"

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Static Host Deployment

The game requires **no build step**. Deploy to any static host:

### Netlify
```bash
netlify deploy --dir=.
```

### Vercel
```bash
vercel
```

### GitHub Pages
1. Push to GitHub
2. Settings → Pages → Source: main branch
3. Site available at https://username.github.io/repo-name

### Traditional Hosting (Bluehost, GoDaddy, etc.)
Upload all files via FTP to public_html/ folder. No server configuration needed.

## File Structure
```
.
├── index.html           # Main entry point
├── css/                 # Stylesheets
├── js/                  # Game logic
├── data/                # Game configuration (levels.json)
├── assets/              # Audio files (if any)
├── test-*.html          # Test utilities (optional)
├── README.md
└── DEPLOYMENT.md        # This file
```

## Audio & Media
All audio files should be placed in `assets/` folder. Supported formats:
- MP3 (best browser support)
- OGG (smaller file size)
- WAV (no compression)

## Performance Optimization
- Minify CSS/JS for production (optional - not required for static hosting)
- Optimize audio files (compress to under 100KB per file)
- Use .webp format for images if supported

## Testing Checklist
- [ ] Game loads on first visit
- [ ] Level 1 unlocked, 2-5 locked
- [ ] Drag-and-drop works on desktop and mobile
- [ ] Sound toggle works
- [ ] State persists after page reload
- [ ] All 5 levels complete successfully
- [ ] Level unlocks work at score thresholds: 50, 80, 100, 120

## Browser Storage
Game uses localStorage. Clear with:
```javascript
// In browser console
localStorage.removeItem('mathgame_state')
```

## Troubleshooting
- **Sounds not playing:** Check audio files in `assets/` folder exist and paths are correct
- **Levels not unlocking:** Verify `data/levels.json` has correct `unlockThreshold` values
- **State not persisting:** Check browser localStorage is enabled
- **Mobile drag issues:** Ensure viewport meta tag is in index.html (already included)
