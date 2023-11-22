### API

---

##### Регистрация и авторизация
Получение пользователей  
GET: api/v1/users/  
Регистрация пользователя, поля: first_name, last_name, email, password, confirm_password, accept_policy  
POST: api/v1/users/  
Переход по ссылке из письма на 127.0.0.1:3000/activate/<pk>/<token>/  
Обработка данного запроса на фронте, ответный запрос на api  
GET: api/v1/confirm-email/<pk>/<token>/  
Возвращается два токена, происходит авторизация  
Получение токенов, поля: username, password  
POST: api/v1/token/
Обновление access токена, поле: refresh  
POST: api/v1/token/refresh/  
Получение пользователя  
GET: api/v1/get-user/
Сброс пароля, поле: email  
POST: api/v1/password/reset/  
Переход по ссылке из письма на 127.0.0.1:3000/reset-password/<pk>/<token>/  
Обработка данного запроса на фронте, ответный запрос на api  
GET: api/v1/password/reset/confirm/<pk>/<token>/  
Возвращается два токена, происходит авторизация  
Отправляется запрос смены пароля с полями: new_password, confirm_new_password  
POST: api/v1/password/reset/complete/  
Добавление клиента, поля: first_name, last_name, email  
POST: api/v1/clients/add/  
Клиент переходит по ссылке из письма на 127.0.0.1:3000/activate-client/<pk>/<token>/  
Обработка данного запроса на фронте, ответный запрос на api  
GET: api/v1/confirm-email/<pk>/<token>/  
Возвращается два токена, происходит авторизация  
Клиент попадает на форму авторизации, поля:  
автозаполненные: first_name, last_name, email  
Вводимые пользователем: password, confirm_password, accept_policy  
PUT: api/v1/update-client/<pk>/  

##### Задачи
Создание задачи, поля: title, text, assignment_type, tags, language, blocks[question, type, choice_replies[reply, reply ...]]  
POST: api/v1/assignments/add/  
Список задач  
GET: api/v1/assignments/  
Добавление задачи в My List  
GET: api/v1/assignments/add-list/<pk>/  
Удаление задачи из My List  
GET: api/v1/assignments/delete-list/<pk>/  
