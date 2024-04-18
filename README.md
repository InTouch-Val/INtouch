### API

---
### pre-commit установка

`pre-commit` поможет избавиться от pep8 ошибок и импортов перед коммитом в репу

**Установка:**
```bash
pre-commit install
```

**Использование:**
```bash
pre-commit run --all-files
```

Также используется автоматически при коммите! (если что-то не так - информирует
 и не дает коммиту пройти до фикса проблемы)

### Регистрация и авторизация
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

### Задачи
**POST: api/v1/assignments/** - создание задачи  
Тело запроса: title, text, assignment_type, tags, language, image_url, blocks[question, description, type, choice_replies[reply, reply ...], start_range, end_range]  

**GET: api/v1/assignments?limit=`<int>`&offset=`<int>`&ordering=`-add_date/add-date`&ordering=`-share/share`&language=`<str>`&assingment_type=`<str>`** - список задач
- `"limit"` - кол-во возвращаемых заданий
- `"offset"` - начальная точка, с какого задания начинать, по-хорошему должно быть 0
- `"-add-date / add-date"` - если передавать с минусом, от новых -> старым, если просто то от старых -> новым  
*!!! нельзя передавать вместе с `-share/share` !!!*
- `"-share / share"` если передавать с минусом, от больших -> меньшему, если просто, то от меньших -> большему  
*!!! нельзя передавать вместе с `-add-date/add-date` !!!*
- `"language"` - выбирается из списка языков, который обговаривался ранее (по тегам en, de и т.д.)
- `"assignment_type"` - выбирается из левой части списка `ASSIGNMENT_TYPES`, правая расшифровка, это нововведение для облегчения жизни и нам, и вам прикладываю его ниже вместе с тегами языков  
```python
ASSIGNMENT_TYPES = [
    ("lesson", "Lesson"),
    ("exercise", "Exercise"),
    ("essay", "Essay"),
    ("study", "Study"),
    ("quiz", "Quiz"),
    ("methodology", "Methodology"),
    ("metaphors", "Metaphors"),
]

LANGUAGES = [
    ("fr", "French"),
    ("en", "English"),
    ("es", "Spanish"),
    ("de", "German"),
    ("it", "Italian"),
    ("ot", "Other"),
]
```

**GET: api/v1/assignments/{pk}/** - получение задачи по id  
**DELETE: api/v1/assignments/{pk}** - удаление задания  
**PUT: api/v1/assignments/{pk}** - редактирование задания  
**GET: api/v1/assignments/{pk}/draft/** - перемещение задания в draft  
**GET: api/v1/assignments/add-list/{pk}/** - добавление задачи в My List  
**GET: api/v1/assignments/delete-list/{pk}/** - удаление задачи из My List  
**GET: api/v1/assignments/set-client/{pk}/{client_pk}/** - назначение задачи клиенту  
**GET: api/v1/assignments-client?user=`<user_id>`&limit=`<int>`&offset=`<int>`** - список задач клиентов  
Теперь имеет возможности передавать `query` параметры для фильтра:  
- `"user"` - клиент  
- `"limit"` - кол-во возвращаемых заданий
- `"offset"` - начальная точка, с какого задания начинать, по-хорошему должно быть 0  

_**Возможно стоит применить логику из api/v1/diary-notes/_

**GET: api/v1/assignments-client/{pk}/** - получение задачи клиента по id  
**DELETE: api/v1/assignments-client/{pk}/** - удаление задания клиента  
**PUT: api/v1/assignments-client/{pk}/** - редактирование задания клиента  
**GET: api/v1/assignments-client/{pk}/complete/** - смена статуса задания на DONE  
**GET: api/v1/assignments-client/{pk}/clear/** - очистка задания клиента  
**POST: api/v1/assignments-client/pk/visible/** - изменение видимости записи в задания для доктора  
Дубликат задания клиента - запрос на **GET: api/v1/assignments/set-client/{pk}/{client_pk}/**  
pk - из поля assignments_root  

### Заметки
**GET: api/v1/notes/** - список заметок  
**GET: api/v1/notes/{pk}/** - получение заметки по id  
**POST: api/v1/notes/** - создание заметки  
Тело запроса: title, content  
**DELETE: api/v1/notes/{pk}/** - удаление заметки  

### Дневники
**GET: api/v1/diary-notes?author=`<user_id>`&limit=`<int>`&offset=`<int>`** - список заметок в дневнике  
Теперь имеет возможности передавать `query` параметры для фильтра:  
- `"author"` - автора заметки  
клиент не нуждается в фильтре, ему возвращаются свои записи, фильтр нужен только для доктора
- `"limit"` - кол-во возвращаемых заданий
- `"offset"` - начальная точка, с какого задания начинать, по-хорошему должно быть 0  
_TODO: Возможно стоит поменять логику, но смысл возвращать клиенту больше чем свои записи? Тем более придется мучаться с пермишенами_

**GET: api/v1/diary-notes/{pk}/** - получение заметки в дневнике по id  
**POST: api/v1/diary-notes/** - создание заметки в дневнике  
Тело запроса: title, content  
**DELETE: api/v1/diary-notes/{pk}/** - удаление заметки в дневнике  
**POST: api/v1/diary-notes/pk/visible/** - изменение видимости записи в дневнике

## Фронтенд

### Окружение

- [Node.js 20 (LTS) и новее](https://nodejs.org/en/download)

### Настройка переменных окружения

Чтобы работал поиск по изображениям, необходимо получить ключ доступа к API Unsplash.
Для этого [зарегистрируйтесь на Unsplash, создайте приложение](https://unsplash.com/documentation#creating-a-developer-account) и скопируйте Access Key.

После получения Access Key, в проекте в директории `/frontend` нужно создать копию файла `.env.example` и переименовать его в `.env`.
В файле `.env` заменить у переменной `VITE_APP_UNSPLASH_ACCESS_KEY` значение на ранее полученный Access Key.

### Установка зависимостей

Перейти в директорию `frontend` и установить зависимости:

```sh
cd frontend
npm install
```

### Запуск фронтенд-сервера

Запустить фронтенд-сервер:

```sh
npm start
```

Фронтенд-сервер запустится по адресу: http://localhost:5273

### Сборка фронтенда

Собрать фронтенд для деплоя:

```shell
npm run build
```

Готовый фронтенд будет в папке `dist`.
