import React from "react";
import "../../css/app.scss";
import { Link, useLocation } from "react-router-dom";

function AfterRegistrationConfirmEmail() {
  const location = useLocation();
  const emailData = location.state?.emailData || "your email address";

  return (
    <section className="confirmation-page">
      <div className="confirmation-container">
        <div className="confirmation-container__content">
          <h1 className="confirmation-container__header">
            Email Confirmation Required
          </h1>
          <div className="confirmation-container__main-content description-content">
            <p>We’ve sent you an email to</p>
            <p className="description-content__email">{emailData}</p>

            <p>
              Please check your inbox and follow the link provided to activate
              your account.
            </p>

            <p>
              If you haven’t received the email, please ensure that your email
              address is correct and check your spam folder.
            </p>
            <Link
              to="/registration"
              className="action-button description-content__back"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export { AfterRegistrationConfirmEmail };
