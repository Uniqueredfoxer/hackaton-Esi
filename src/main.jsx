import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Router from './appRouter';
import { Toaster } from 'react-hot-toast';
import './index.css';
import { RouterProvider } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={Router}/>
  </StrictMode>,
)
