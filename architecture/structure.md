# Структура проекта Service Desk системы

## Общая структура каталогов

```
/root/tiket/
├── architecture/                 # Документация по архитектуре
├── backend/                      # Backend часть (Express.js)
│   ├── src/                      # Исходный код backend
│   │   ├── controllers/          # Контроллеры для обработки запросов
│   │   ├── routes/               # Определения маршрутов
│   │   ├── middleware/           # Промежуточное ПО
│   │   ├── models/               # Модели данных
│   │   ├── config/               # Файлы конфигурации
│   │   ├── utils/                # Вспомогательные функции
│   │   ├── app.js                # Основной файл приложения
│   │   └── server.js             # Файл для запуска сервера
│   ├── tests/                    # Тесты backend
│   ├── package.json              # Зависимости и скрипты backend
│   └── .env                      # Переменные окружения
├── frontend/                     # Frontend часть (React)
│   ├── public/                   # Статические файлы
│   ├── src/                      # Исходный код frontend
│   │   ├── components/            # Компоненты React
│   │   ├── pages/                # Статраницы приложения
│   │   ├── services/              # Сервисы для работы с API
│   │   ├── utils/                # Вспомогательные функции
│   │   ├── assets/               # Ассеты (изображения, стили и т.д.)
│   │   ├── App.js                # Основной компонент приложения
│   │   └── index.js              # Точка входа frontend приложения
│   ├── package.json              # Зависимости и скрипты frontend
│   └── .env                      # Переменные окружения
├── docs/                         # Документация по API и другая
├── docker-compose.yml            # Конфигурация Docker Compose
└── README.md                     # Основная документация проекта
```

## Обеспечение модульности и расширяемости архитектуры

### Принципы модульности

1. **Разделение ответственности (Separation of Concerns)**:
   - Каждый модуль имеет одну четко определенную ответственность
   - Контроллеры обрабатывают запросы и возвращают ответы
   - Сервисы содержат бизнес-логику
   - Модели работают с данными
   - Middleware обрабатывает промежуточные задачи

2. **Инкапсуляция**:
   - Внутренняя реализация модулей скрыта от других частей приложения
   - Модули взаимодействуют через четко определенные интерфейсы

3. **Низкая связанность и высокое зацепление**:
   - Модули зависят от абстракций, а не от конкретных реализаций
   - Каждый модуль содержит связанные функции, решающие одну задачу

### Расширяемость архитектуры

1. **Горизонтальное масштабирование**:
   - Архитектура позволяет добавлять новые модули без изменения существующих
   - Использование маршрутов позволяет легко добавлять новые endpoint'ы

2. **Вертикальное масштабирование**:
   - Возможность расширения функциональности внутри существующих модулей
   - Использование наследования и композиции для расширения возможностей

3. **Плагинная архитектура**:
   - Middleware позволяет добавлять новую функциональность без изменения основного кода
   - Использование конфигурационных файлов для управления поведением приложения

### Практические рекомендации

1. **Использование маршрутов**:
   ```javascript
   // Вместо определения всех маршрутов в app.js
   app.use('/api/users', userRoutes);
   app.use('/api/tickets', ticketRoutes);
   
   // Каждый файл маршрутов определяет свои endpoint'ы
   // routes/userRoutes.js
   router.get('/', userController.getAllUsers);
   router.get('/:id', userController.getUserById);
   ```

2. **Контроллеры как интерфейс**:
   ```javascript
   // controllers/userController.js
   const userService = require('../services/userService');
   
   exports.getAllUsers = async (req, res, next) => {
     try {
       const users = await userService.getAllUsers();
       res.json(users);
     } catch (error) {
       next(error);
     }
   };
   ```

3. **Сервисы как реализация бизнес-логики**:
   ```javascript
   // services/userService.js
   const User = require('../models/User');
   
   exports.getAllUsers = async () => {
     return await User.findAll();
   };
   ```

4. **Модели как представление данных**:
   ```javascript
   // models/User.js
   const { DataTypes } = require('sequelize');
   const sequelize = require('../config/database');
   
   const User = sequelize.define('User', {
     username: DataTypes.STRING,
     email: DataTypes.STRING
   });
   
   module.exports = User;
   ```

## Работа с различными окружениями

### Конфигурация окружений

Для управления различными окружениями используется библиотека `dotenv`, которая позволяет загружать переменные окружения из файлов `.env`.

#### Development (.env.development)
```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=service_desk_dev
DB_USER=developer
DB_PASSWORD=dev_password
JWT_SECRET=dev_secret_key
LOGGING=true
```

#### Production (.env.production)
```
NODE_ENV=production
PORT=8080
DB_HOST=prod-db-server
DB_PORT=5432
DB_NAME=service_desk_prod
DB_USER=prod_user
DB_PASSWORD=secure_password
JWT_SECRET=super_secret_key_for_production
LOGGING=false
```

#### Тестирование (.env.test)
```
NODE_ENV=test
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=service_desk_test
DB_USER=test_user
DB_PASSWORD=test_password
JWT_SECRET=test_secret_key
LOGGING=false
```

### Управление конфигурацией

Для управления конфигурацией в зависимости от окружения создается специальный модуль конфигурации:

```javascript
// config/index.js
const dotenv = require('dotenv');

// Загрузка переменных окружения в зависимости от NODE_ENV
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  },
  jwt: {
    secret: process.env.JWT_SECRET
  },
  logging: process.env.LOGGING === 'true'
};
```

### Использование в приложении

```javascript
// app.js
const config = require('./config');

// В зависимости от NODE_ENV будут загружены соответствующие переменные
if (config.env === 'development') {
  console.log('Running in development mode');
} else if (config.env === 'production') {
  console.log('Running in production mode');
}
```

## Подробное описание структуры backend части

### 1. controllers/
Каталог для контроллеров, которые обрабатывают запросы и возвращают ответы. Каждый контроллер отвечает за определенную функциональность:
- `authController.js` - аутентификация и авторизация
- `ticketController.js` - работа с заявками
- `userController.js` - работа с пользователями
- `commentController.js` - работа с комментариями

### 2. routes/
Каталог для определения маршрутов API:
- `authRoutes.js` - маршруты для аутентификации
- `ticketRoutes.js` - маршруты для работы с заявками
- `userRoutes.js` - маршруты для работы с пользователями
- `index.js` - объединение всех маршрутов

### 3. middleware/
Каталог для промежуточного ПО:
- `authMiddleware.js` - проверка аутентификации
- `errorMiddleware.js` - обработка ошибок
- `validationMiddleware.js` - валидация входных данных

### 4. models/
Каталог для моделей данных:
- `userModel.js` - модель пользователя
- `ticketModel.js` - модель заявки
- `commentModel.js` - модель комментария

### 5. config/
Каталог для файлов конфигурации:
- `database.js` - конфигурация базы данных
- `jwt.js` - конфигурация JWT
- `cors.js` - конфигурация CORS

### 6. utils/
Каталог для вспомогательных функций:
- `logger.js` - логирование
- `errorHandler.js` - обработка ошибок
- `validators.js` - валидация данных

## Базовая настройка Express.js сервера

### server.js
Файл для запуска сервера Express.js:

```javascript
const app = require('./app');
const config = require('./config');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### app.js
Основной файл приложения Express.js:

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

// Загрузка переменных окружения
dotenv.config();

// Создание экземпляра Express приложения
const app = express();

// Middleware
app.use(helmet()); // Безопасность
app.use(cors()); // CORS
app.use(express.json()); // Парсинг JSON в теле запроса
app.use(express.urlencoded({ extended: true })); // Парсинг URL-encoded данных

// Маршруты
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Базовый маршрут для проверки работы сервера
app.get('/', (req, res) => {
  res.json({ message: 'Service Desk API' });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Обработка несуществующих маршрутов
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
```

## Подробное описание структуры frontend части

### 1. components/
Каталог для переиспользуемых компонентов:
- `common/` - общие компоненты (кнопки, формы и т.д.)
- `ticket/` - компоненты для работы с заявками
- `auth/` - компоненты для аутентификации

### 2. pages/
Каталог для страниц приложения:
- `Home.js` - главная страница
- `Login.js` - страница входа
- `Tickets.js` - страница со списком заявок
- `TicketDetail.js` - страница деталей заявки

### 3. services/
Каталог для сервисов взаимодействия с API:
- `api.js` - базовая конфигурация API
- `authService.js` - сервисы аутентификации
- `ticketService.js` - сервисы работы с заявками

### 4. utils/
Каталог для вспомогательных функций:
- `helpers.js` - вспомогательные функции
- `constants.js` - константы приложения

## Файлы конфигурации для разных окружений

### Development (.env.development)
```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=service_desk_dev
DB_USER=developer
DB_PASSWORD=dev_password
JWT_SECRET=dev_secret_key
```

### Production (.env.production)
```
NODE_ENV=production
PORT=8080
DB_HOST=prod-db-server
DB_PORT=5432
DB_NAME=service_desk_prod
DB_USER=prod_user
DB_PASSWORD=secure_password
JWT_SECRET=super_secret_key_for_production
```

## Зависимости backend (package.json)

```json
{
  "name": "service-desk-backend",
  "version": "1.0.0",
  "description": "Backend for Service Desk system",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "dotenv": "^16.3.1",
    "jsonwebtoken": "^9.0.1",
    "bcryptjs": "^2.4.3",
    "joi": "^17.9.2",
    "pg": "^8.11.1",
    "sequelize": "^6.32.1",
    "winston": "^3.10.0",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.1",
    "supertest": "^6.3.3"
  }
}
```

## Зависимости frontend (package.json)

```json
{
  "name": "service-desk-frontend",
  "version": "1.0.0",
  "description": "Frontend for Service Desk system",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.2",
    "axios": "^1.4.0",
    "redux": "^4.2.1",
    "react-redux": "^8.1.1",
    "@reduxjs/toolkit": "^1.9.5"
  },
  "devDependencies": {
    "react-scripts": "5.0.1",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}