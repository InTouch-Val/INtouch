//@ts-nocheck
import React, { StrictMode } from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./service/authContext";
import { ErrorPage } from "./service/forms/error-page";
import { RegistrationForm } from "./service/forms/registration-page";
import { LoginPage } from "./service/forms/login-page";
import { PasswordResetRequested } from "./service/forms/password-reset-requested";
import { ActivateUserPage } from "./service/forms/activate-user-page";
import { PasswordResetMock } from "./service/forms/password-reset-mock";
import { ClientRegistrationPage } from "./service/forms/client-registration-page";
import { AfterRegistrationPage } from "./service/forms/after-registration-welcome-page";
import { ClientPage } from "./routes/client-page";
import { CommunityPage } from "./routes/community-page";
import { SettingsPage } from "./routes/SettingPage/settings-page";
import { App } from "./components/App";
import { AddAssignment, ViewAssignment } from "./components/psy/AddAssignment";
import { AddClient } from "./components/psy/AddClient";
import { AddNote } from "./components/psy/AddNote";
import { ClientDetailsPage } from "./components/psy/ClientDetailsPage";
import { ClientAssignments } from "./components/client/ClientAssignments";
import { CompleteAssignments } from "./components/client/CompleteAssignments/CompleteAssignments";
import "./index.css";
import { DiaryPage, loaderDiaryById } from "./routes/diary-page";
import { loaderEmotionsById } from "./components/client/MyDiary/MobileEmotionPage/EmotionsRouteHandler";
import DiaryPageClient from "./routes/client/my-diary-page";
import ConfirmEmail from "./service/forms/confirm-email";
import MobileEmotionPage from "./components/client/MyDiary/MobileEmotionPage/MobileEmotionPage";
import AssignmentsPageRefactor from "./routes/AssignmentsPageRefactor/AssignmentsPage";
import { AfterRegistrationConfirmEmail } from "./service/forms/after-registration-email-confirmation";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/clients",
        element: <ClientPage />,
      },
      {
        path: "/my-diary",
        element: <DiaryPageClient />,
      },

      {
        path: "/clients/:id",
        element: <ClientDetailsPage />,
      },
      {
        path: "/clients/:id/assignments/:id",
        element: <CompleteAssignments />,
      },
      {
        path: "/assignments",
        element: <AssignmentsPageRefactor />,
      },
      {
        path: "/assignment/:id",
        element: <ViewAssignment />,
      },
      {
        path: "/community",
        element: <CommunityPage />,
      },
      // {
      //   path: '/community/:chatId',
      //   element: <Chat />,
      // },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
      {
        path: "/add-assignment",
        element: <AddAssignment />,
      },
      {
        path: "/edit-assignment/:id",
        element: <AddAssignment />,
      },
      {
        path: "/add-client",
        element: <AddClient />,
      },
      {
        path: "/add-note/:id",
        element: <AddNote />,
      },
      {
        path: "/my-assignments",
        element: <ClientAssignments />,
      },
      {
        path: "/my-assignments/:id",
        element: <CompleteAssignments />,
      },
      {
        path: "/diary/:id",
        element: <DiaryPage type="exist" />,
        loader: loaderDiaryById,
      },
      { path: "/my-diary/create", element: <DiaryPage type="create" /> },
      {
        path: "/diary/:id/choose-emotions",
        element: <MobileEmotionPage type="exist" />,
        loader: loaderEmotionsById,
      },
      {
        path: "/my-diary/create/add-emotions",
        element: <MobileEmotionPage type="create" />,
      },
    ],
  },
  {
    path: "/registration",
    element: <RegistrationForm />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
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
    element: <ClientRegistrationPage />,
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
  },
  {
    path: "/email-update/:pk/:token",
    element: <ConfirmEmail />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/welcome-to-intouch",
    element: <AfterRegistrationPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/email-confirmation",
    element: <AfterRegistrationConfirmEmail />,
    errorElement: <ErrorPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
  </StrictMode>,
);
