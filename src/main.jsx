import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Htrans from './pages/Htrans.jsx';
import KasirPage from './pages/KasirPage.jsx';
// import Navbar from './components/Navbar.jsx';


const router = createBrowserRouter([
  {
    path:"/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <KasirPage/>
      },
      {
        path: "/list",
        element: <Htrans/>
      },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
