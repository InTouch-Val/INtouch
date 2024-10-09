export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[^\W\d_]+\.[a-zA-Z]{2,}$/;
  //До символа "@" может быть любое количество буквенно-цифровых символов, а также точки, подчеркивания, проценты, плюсы и дефисы.
  //После "@" следует доменное имя, состоящее из буквенно-цифровых символов, точек и дефисов.
  //Затем идет точка и домен верхнего уровня, состоящий минимум из двух букв.
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  const passwordRegex =
    /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?!.*(.)(?=\1\1\1))[a-zA-Z\d~!?@#$%^&*_+\-(){}\[\]><\/|'.,:;]{7,128}$/;
  //Содержит хотя бы одну букву.
  //Содержит хотя бы одну цифру.
  //(?=.*[A-Z]) - требует хотя бы одну заглавную букву.
  //(?=.*[a-z]) - требует хотя бы одну строчную букву.
  //(?!.*\s) - проверяет, что в строке нет пробелов. \s является специальным символом, который соответствует любому пробельному символу, включая пробелы, табуляции и переносы строк.
  //Не содержит трех повторяющихся подряд идущих одинаковых символов.
  //Имеет длину от 8 до 128 символов.
  //Состоит только из латинских букв и указанных разрешенных символов ~!?@#$%^&*_\-+(){}\[\]><\/|'.,:;.
  return passwordRegex.test(password);
};

export const isValidName = (name: string): boolean => {
  const nameRegex = /^(?=^.{2,50}$)[A-Za-z]+(?:[.\- ]+[A-Za-z]+)*\.?$/;
  // Names can start with letters.
  // Hyphens, periods, and spaces are allowed.
  // Initials followed by a period (like "M.") are allowed after a space.
  // Multiple parts of the name (like "Mary L. Jones") are allowed after spaces.
  //Allows dot at the end
  return nameRegex.test(name.trim());
};
