import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
// self-hosted (no CDN): THEIR stack, lifted from blk.jo's own stylesheets —
// Tajawal carries everything, Aref Ruqaa is the handwritten cup-copy voice
// (the كيف قهوتك؟ script). Same families, so the pitch tastes like the brand.
import '@fontsource/tajawal/400.css'
import '@fontsource/tajawal/500.css'
import '@fontsource/tajawal/700.css'
import '@fontsource/tajawal/800.css'
import '@fontsource/aref-ruqaa/400.css'
import '@fontsource/aref-ruqaa/700.css'
import 'lenis/dist/lenis.css'
import './styles.css'
import './styles-v3.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
