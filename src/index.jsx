import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { AuthProvider } from './service/authContext.js';
import ErrorPage from './service/forms/error-page.jsx';
import ClientPage from './routes/client-page.jsx';
import ClientDetailPage from './components/ClientsDetailsPage.jsx';
import AssignmentsPage from './routes/assignments-page.jsx';
import CommunityPage from './routes/community-page.jsx'; 
import RegistrationForm from './service/forms/registration-page.jsx';
import LoginPage from './service/forms/login-page.jsx';
import SettingsPage from './routes/settings-page.jsx';
import PasswordResetRequested from './service/forms/password-reset-requested.jsx';
import {AddAssignment, ViewAssignment} from "./components/AddAssignment.jsx"
import ActivateUserPage from './service/forms/activate-user-page.jsx';
import PasswordResetMock from './service/forms/password-reset-mock.jsx';
import AddClient from './components/AddClient.jsx';
import ClientRegistrationPage from './service/forms/client-registration-page.jsx';

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
        path: '/assignment/:id',
        element: <ViewAssignment/>
      },
      {
        path: '/community',
        element: <CommunityPage />,
      },
      // {
      //   path: '/community/:chatId',
      //   element: <Chat />, 
      // },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
      {
        path: "/add-assignment",
        element: <AddAssignment/>
      },
      {
        path: "/add-client",
        element: <AddClient/>
      }
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
  },
  {
    path: "/password-reset-requested",
    element: <PasswordResetRequested />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/client-registration",
    element: <ClientRegistrationPage/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/activate/:userId/:userToken",  
    element: <ActivateUserPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/activate-client/:userId/:userToken",  
    element: <ActivateUserPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/reset-password/:pk/:token",
    element: <PasswordResetMock />,
    errorElement: <ErrorPage />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
  </React.StrictMode>
);
