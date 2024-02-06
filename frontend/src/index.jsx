import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './service/authContext';
import { ErrorPage } from './service/forms/error-page';
import { RegistrationForm } from './service/forms/registration-page';
import { LoginPage } from './service/forms/login-page';
import { PasswordResetRequested } from './service/forms/password-reset-requested';
import { ActivateUserPage } from './service/forms/activate-user-page';
import { PasswordResetMock } from './service/forms/password-reset-mock';
import { ClientRegistrationPage } from './service/forms/client-registration-page';
import { AfterRegistrationPage } from './service/forms/after-registration-welcome-page';
import { ClientPage } from './routes/client-page';
import { AssignmentsPage } from './routes/assignments-page';
import { CommunityPage } from './routes/community-page';
import { SettingsPage } from './routes/settings-page';
import { App } from './components/App';
import { AddAssignment, ViewAssignment } from './components/AddAssignment';
import { AddClient } from './components/AddClient';
import { AddNote } from './components/AddNote';
import ClientDetailPage from './components/ClientsDetailsPage';
import { ClientsAssignments } from './clients-components/ClientsAssignments';

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
        element: <ViewAssignment />,
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
        path: '/add-assignment',
        element: <AddAssignment />,
      },
      {
        path: '/edit-assignment/:id',
        element: <AddAssignment />,
      },
      {
        path: '/add-client',
        element: <AddClient />,
      },
      {
        path: '/add-note/:id',
        element: <AddNote />,
      },
      {
        path: "/my-assignments",
        element: <ClientsAssignments/>
      },
      {
        path:"/my-assignments/1",
        element:<CompleteAssignments/>
      }
    ],
  },
  {
    path: '/registration',
    element: <RegistrationForm />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/password-reset-requested',
    element: <PasswordResetRequested />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/client-registration',
    element: <ClientRegistrationPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/activate/:userId/:userToken',
    element: <ActivateUserPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/activate-client/:userId/:userToken',
    element: <ActivateUserPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/reset-password/:pk/:token',
    element: <PasswordResetMock />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/welcome-to-intouch',
    element: <AfterRegistrationPage />,
    errorElement: <ErrorPage />,
  },
]);

createRoot(document.querySelector('#root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
