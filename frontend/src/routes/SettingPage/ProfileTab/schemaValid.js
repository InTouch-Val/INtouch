import * as yup from 'yup';

export const updateUserForm = yup.object({
  firstName: yup
    .string()
    .min(2, 'Please enter a valid name (2-50 characters)')
    .max(50, 'Please enter a valid name (2-50 characters)')
    .trim(),
  lastName: yup
    .string()
    .trim()
    .min(2, 'Please enter a valid name (2-50 characters)')
    .max(50, 'Please enter a valid name (2-50 characters)'),
  email: yup
    .string()
    .email('Please make sure your email address is in the format example@example.com')
    .trim()
    .required('Email required'),
  dateOfBirth: yup.string(),
});
