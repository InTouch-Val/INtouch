export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?!.*(.)(?=\1\1\1)).{8,128}[a-zA-Z0-9~!?@#$%^&*_\-+(){}\[\]><\/|'.,:;]$/;
  return passwordRegex.test(password);
};
