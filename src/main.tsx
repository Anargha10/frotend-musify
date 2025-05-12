import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SongProvider } from './context/songContext.tsx'
import { UserProvider } from './context/userContext.tsx'
import { SearchProvider } from './context/searchbarContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
    <SongProvider>
      <SearchProvider>
    <App />
    </SearchProvider>
    </SongProvider>
    </UserProvider>
  </StrictMode>,
)
