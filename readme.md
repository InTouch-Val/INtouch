### API

---

##### Регистрация и авторизация 
**GET: api/v1/users/** - список пользователей  
**POST: api/v1/users/** - регистрация пользователя  
Тело запроса: first_name, last_name, email, password, confirm_password, accept_policy.  
**GET: api/v1/confirm-email/{pk}/{token}/**  - активация аккаунта
pk, token из url из письма. Возвращает access и refresh токены.  
**POST: api/v1/token/** - авторизация  
Тело запроса: username, password. Возвращает access и refresh токены.  
**POST: api/v1/token/refresh/**  обновление токенов  
Тело запроса: refresh. Возвращает access и refresh токены.  
**GET: api/v1/get-user/** - получение данных авторизованного пользователя   
**POST: api/v1/password/reset/** - запрос на восстановление пароля  
Тело запроса: email  
**GET: api/v1/password/reset/confirm/{pk}/{token}/** - подтверждение сброса пароля    
pk, token из url из письма. Возвращает access и refresh токены.  
**POST: api/v1/password/reset/complete/** - установка нового пароля  
Тело запроса: new_password, confirm_new_password  
  
**POST: api/v1/clients/add/** - добавление клиента  
Тело запроса: first_name, last_name, email  
Клиент переходит по ссылке из письма на 127.0.0.1:3000/activate-client/{pk}/{token}/  
Обработка данного запроса на фронте, ответный запрос на api  
**GET: api/v1/confirm-email/{pk}/{token}/** - активация клиента  
pk, token из url из письма. Возвращает access и refresh токены.   
**PUT: api/v1/update-client/{pk}/** - завершение регистрации клиента  
Тело запроса:  
Автозаполненные: first_name, last_name, email  
Вводимые пользователем: password, confirm_password, accept_policy  
**PUT: api/v1/user/update/{pk}/** - изменение данных пользователя  
Тело запроса: first_name, last_name, email, date_of_birth, photo  
**POST: api/v1/user/update/password/** - изменение пароля пользователя  
Тело запроса: password, new_password, confirm_new_password  
**DELETE: api/v1/client/delete/{pk}/** - удаление клиента  
**PUT: api/v1/client/update/{pk}/** - редактирование данных о клиенте  
Тело запроса: date_of_birth, client{diagnosis, about}  

##### Задачи
**POST: api/v1/assignments/add/** - создание задачи  
Тело запроса: title, text, assignment_type, tags, language, image_url, blocks[question, type, choice_replies[reply, reply ...], start_range, end_range]  
**GET: api/v1/assignments/** - список задач  
**GET: api/v1/assignments/add-list/{pk}/** - добавление задачи в My List  
**GET: api/v1/assignments/delete-list/{pk}/** - удаление задачи из My List  
**GET: api/v1/assignments/set-client/{pk}/{client_pk}/** - назначение задачи клиенту  
**GET: api/v1/assignments/{pk}/** - получение задачи по id  
**GET: api/v1/assignments-client/** - список задач клиентов  
