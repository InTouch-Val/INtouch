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
GET: api/v1/get-user/<token>/  
Добавление клиента, поля: first_name, last_name, email, doctor_id(id пользователя, который добавляет клиента)  
POST: api/v1/clients/add/  
Получение клиентов(user - ссылка на самого пользователя, doctor - ссылка на пользователя, являющегося доктором)  
GET: api/v1/clients/  
##### Задачи
Создание задачи, поля: title, text, assignment_type, tags, language, blocks[question, choice_replies[reply, reply ...]]  
POST: api/v1/assignments/add/  
Список задач  
GET: api/v1/assignments/
