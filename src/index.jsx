import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import ErrorPage from './components/error-page.jsx';
import ClientPage from './routes/client-page.jsx';
import ClientDetailPage from './components/client-details-page.jsx';
import AssignmentsPage from './routes/assignments-page.jsx';
import CommunityPage from './routes/community-page.jsx'; 
import Chat from './components/Chat.jsx';
import StoragePage from './routes/storage.jsx';
import RegistrationForm from './components/registration-page.jsx';
import LoginPage from './components/login-page.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/clients',
        element: <ClientPage />,
      },
      {
        path: '/clients/:id',
        element: <ClientDetailPage />,
      },
      {
        path: '/assignments',
        element: <AssignmentsPage />,
      },
      {
        path: '/community',
        element: <CommunityPage />,
      },
      {
        path: '/community/:chatId',
        element: <Chat />, // Добавляем маршрут для чата
      },
      {
        path: '/storage',
        element: <StoragePage />, 
      },
    ],
  },
  {
    path: "/registration",
    element: <RegistrationForm />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
