import * as yup from "yup";

export const clientRegistrationSchema = yup.object({
  password: yup
    .string()
    .required("Password is required.")
    .matches(
      /^(?!.*(?:password|123456|qwerty|abc123|letmein|iloveyou|admin|welcome|monkey|123456789)).*$/,
      "This password is too common.",
    ) // Пример проверки на распространенные пароли
    .test(
      "min-letters",
      "This password must contain at least 2 letters.",
      (value) => {
        const letterCount = (value.match(/[a-zA-Z]/g) || []).length;
        return letterCount >= 2;
      },
    )
    .min(8, "You must have at least 8 characters in your password")
    .matches(
      /[A-Z]/,
      "This password must contain at least 1 upper case letter.",
    ) // Проверка на наличие заглавной буквы
    .matches(
      /[a-z]/,
      "This password must contain at least 1 lower case letter.",
    )
    .matches(/.*\d.*/, "This password must contain at least 1 digit.") // Проверка на наличие хотя бы 1 цифры
    .trim(), // Проверка на наличие строчной буквы

  confirmPassword: yup
    .string()
    .required("Is required field")
    .oneOf([yup.ref("password")], "Passwords must match"),
  acceptTerms: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions.")
    .required("You must accept the terms and conditions."),
});
