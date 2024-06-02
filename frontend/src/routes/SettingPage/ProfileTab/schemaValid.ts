//@ts-nocheck
import * as yup from "yup";

export const updateUserForm = yup.object({
  firstName: yup
    .string()
    .min(2, "Please enter a valid name (2-50 characters)")
    .max(50, "Please enter a valid name (2-50 characters)")
    .trim(),
  lastName: yup
    .string()
    .trim()
    .min(2, "Please enter a valid name (2-50 characters)")
    .max(50, "Please enter a valid name (2-50 characters)"),
  email: yup
    .string()
    .email(
      "Please make sure your email address is in the format example@example.com",
    )
    .trim()
    .required("Email required"),
  dateOfBirth: yup.string(),
});


export const diaryClientValidation = yup.object().shape({
  event_details: yup.string(),
  thoughts_analysis: yup.string(),
  physical_sensations: yup.string(),
  emotion_type: yup.string(),
}).test('at-least-one-field', 'At least one field must be filled in', function (value) {
  const { event_details, thoughts_analysis, physical_sensations, emotion_type } = value;
  return !!event_details || !!thoughts_analysis || !!physical_sensations || !!emotion_type;
});