import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
// import App from './Practice.jsx'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ReactDom from 'react-dom/client';  

ReactDom.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
   <StrictMode>
    <App />
  </StrictMode>
  </BrowserRouter>
)
