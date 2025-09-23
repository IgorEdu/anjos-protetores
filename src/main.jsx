import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// 1 - Configurando o router
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// 2 - Importando as rotas
import App from './App.jsx';
import Login from './routes/Login/Login.jsx';
import Cadastro from './routes/Cadastro/Cadastro.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App><Login /></App>,
  },
  {
    path: "cadastro",
    element: <App><Cadastro /></App>,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
