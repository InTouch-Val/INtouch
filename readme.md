### API

---

##### Регистрация и авторизация
Получение пользователей  
GET: api/v1/users/  
Регистрация пользователя, поля: first_name, last_name, email, password, confirm_password, accept_policy  
POST: api/v1/users/  
При переходе по ссылке из письма редирект на страницу /confirm-email-success/
Авторизация, поля: email, password  
POST: api/v1/login/
Добавление клиента, поля: first_name, last_name, email, doctor_id(id пользователя, который добавляет клиента)  
POST: api/v1/clients/add/  
Стандартная схема подтверждения по email  
Получение клиентов(user - ссылка на самого пользователя, doctor - ссылка на пользователя, являющегося доктором)  
GET: api/v1/clients/  
##### Задачи
Создание задачи, поля: title, text, assignment_type, tags, language, author_id  
POST: api/v1/assignments/add/
Список задач  
GET: api/v1/assignments/
Лайк  
GET: api/v1/assignments/<id>/like/  
Дислайк  
GET: api/v1/assignments/<id>/dislike/  
