import React from 'react';
import { useAuth } from '../../../service/authContext';
import { API } from '../../../service/axios';
import '../../../css/settings.css';
import { useForm, Controller } from 'react-hook-form';
import { updateUserForm } from './schemaValid';
import { yupResolver } from '@hookform/resolvers/yup';

export function ProfileTab() {
  const { currentUser, updateUserData } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm({
    defaultValues: {
      firstName: currentUser.first_name || '',
      lastName: currentUser.last_name || '',
      email: currentUser.email || '',
    },
    resolver: yupResolver(updateUserForm),
    mode: 'all',
  });
  const [statusMessageText, setStatusMessageText] = React.useState('');

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await API.put(
        `user/update/${currentUser.id}/`,
        {
          first_name: data.firstName,
          last_name: data.lastName,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      ).then(() => updateUserData());
      setStatusMessageText('Changes saved successfully');

      console.log(response);
    } catch (error) {
      console.error('Error updating profile:' + error);
    }

    try {
      const response = await API.post(
        `user/update/email/`,
        {
          new_email: data.email,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      ).then(() => updateUserData());

      console.log(response);
    } catch (error) {
      console.error('Error updating profile:' + error);
    }
  };

  return (
    <>
      {statusMessageText != '' && <div className="success-message">{statusMessageText}</div>}
      <div className="settings-profile-tab">
        <div className="right-column">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="firstName"
              control={control}
              render={({ field: { ...fieldsProps } }) => (
                <div className="input__container">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    {...fieldsProps}
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    className={
                      !!errors.firstName ? 'settings-input profile__inputError' : 'settings-input'
                    }
                  />
                </div>
              )}
            />
            <Controller
              name="lastName"
              control={control}
              render={({ field: { ...fieldsProps } }) => (
                <div className="input__container">
                  <label htmlFor="lastName">Last Name</label>

                  <input
                    {...fieldsProps}
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    className={
                      !!errors.lastName ? 'settings-input profile__inputError' : 'settings-input'
                    }
                  />
                </div>
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field: { ...fieldsProps } }) => (
                <div className="input__container">
                  <label htmlFor="email">Email</label>
                  <input
                    {...fieldsProps}
                    type="email"
                    name="email"
                    placeholder="Email"
                    className={
                      !!errors.email ? 'settings-input profile__inputError' : 'settings-input'
                    }
                  />
                </div>
              )}
            />
            <div className="profile__errorMessages">
              <div className="profile__fieldError">
                {!!errors.firstName && (
                  <span className="profile__errorText">{errors.firstName?.message}</span>
                )}
                {!!errors.lastName && (
                  <span className="profile__errorText">{errors.lastName?.message}</span>
                )}
                {!!errors.email && (
                  <span className="profile__errorText">{errors.email?.message}</span>
                )}
                {currentUser.new_email_changing && (
                  <span className="profile__errorText">
                    We’ve sent a confirmation email to your new email address —{' '}
                    {currentUser.new_email_temp}. Please check and confirm to complete the email
                    update process. Your current email will remain active until then.
                  </span>
                )}
              </div>
              <div>
                <button className={`save-settings`} type="submit" disabled={!(isValid && isDirty)}>
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
