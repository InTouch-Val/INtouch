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
Добавление клиента, поля: first_name, last_name, email, doctor_id(id пользователя, который добавляет клиента)  
POST: api/v1/clients/add/  
Получение клиентов(user - ссылка на самого пользователя, doctor - ссылка на пользователя, являющегося доктором)  
GET: api/v1/clients/  
##### Задачи
Создание задачи, поля: title, text, assignment_type, tags, language, author_id  
POST: api/v1/assignments/add/  
Список задач  
GET: api/v1/assignments/  
Добавление задачи в MyList(pk - id задачи, user_pk - id юзера)  
GET: api/v1/assignments/<int:pk>/<int:user_pk>/add/  
Удаление задачи из MyList  
GET: api/v1/assignments/<int:pk>/<int:user_pk>/delete/  
Лайк  
GET: api/v1/assignments/<id>/like/  
Дислайк  
GET: api/v1/assignments/<id>/dislike/  
