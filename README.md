# Film React Nest

Веб-приложение для бронирования билетов в кинотеатре. Full-stack приложение с разделением на frontend (React) и backend (NestJS).

## 📋 Описание

Проект представляет собой систему бронирования билетов в кинотеатре с возможностью:
- Просмотра списка доступных фильмов
- Просмотра расписания сеансов для каждого фильма
- Выбора мест в зале
- Оформления заказа на билеты

## 🛠 Технологический стек

### Backend
- **NestJS** (v10.0.0) - прогрессивный Node.js фреймворк для построения эффективных и масштабируемых серверных приложений
- **TypeScript** (v5.1.3) - типизированный JavaScript
- **TypeORM** (v0.3.27) - ORM для работы с PostgreSQL
- **Mongoose** (v8.19.3) - ODM для работы с MongoDB
- **PostgreSQL** - реляционная база данных
- **MongoDB** - NoSQL база данных (поддержка двух типов БД)
- **class-validator** - валидация DTO
- **class-transformer** - трансформация объектов
- **Jest** - фреймворк для тестирования

### Frontend
- **React** (v18.3.1) - библиотека для построения пользовательских интерфейсов
- **TypeScript** (v5.2.2) - типизированный JavaScript
- **Vite** (v5.3.1) - быстрый сборщик и dev-сервер
- **SCSS/SASS** (v1.77.6) - препроцессор CSS
- **Storybook** (v8.1.11) - инструмент для разработки компонентов
- **dayjs** - библиотека для работы с датами
- **clsx** - утилита для условного объединения классов

### Инфраструктура
- **Docker** - контейнеризация приложения
- **Docker Compose** - оркестрация контейнеров
- **Nginx** - веб-сервер для frontend
- **pgAdmin** - веб-интерфейс для управления PostgreSQL

## 📁 Структура проекта

```
film-react-nest/
├── backend/              # Backend приложение (NestJS)
│   ├── src/
│   │   ├── films/       # Модуль фильмов
│   │   ├── order/       # Модуль заказов
│   │   ├── database/    # Конфигурация БД
│   │   ├── repository/  # Репозитории (MongoDB, PostgreSQL)
│   │   ├── loggers/     # Логгеры (Dev, JSON, TSKV)
│   │   └── main.ts      # Точка входа
│   ├── public/          # Статические файлы
│   ├── test/            # E2E тесты
│   └── Dockerfile
├── frontend/            # Frontend приложение (React)
│   ├── src/
│   │   ├── components/  # React компоненты
│   │   ├── hooks/       # Custom hooks
│   │   ├── utils/       # Утилиты
│   │   └── scss/        # Стили
│   ├── nginx/           # Конфигурация Nginx
│   └── Dockerfile
├── docker-compose.yml   # Конфигурация Docker Compose
└── README.md
```

## 🚀 Быстрый старт

### Предварительные требования

- Node.js (v18 или выше)
- Docker и Docker Compose
- npm или yarn

### Установка и запуск

1. **Клонируйте репозиторий:**
```bash
git clone <repository-url>
cd film-react-nest
```

2. **Настройте переменные окружения:**
Создайте файл `.env` в корне проекта со следующими переменными:
```env
# Database
DATABASE_TYPE=postgresql  # или mongodb
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_DATABASE=film_db

# Backend
NODE_ENV=development
LOGGER=dev


# pgAdmin
PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=admin
```

3. **Запуск через Docker Compose:**
```bash
docker-compose up -d
```

Приложение будет доступно по адресу:
- Frontend: http://localhost
- Backend API: http://localhost:3000/api/afisha
- pgAdmin: http://localhost:5050

### Локальная разработка

#### Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend будет доступен на http://localhost:3000

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend будет доступен на http://localhost:5173

## 📝 API Endpoints

### Фильмы
- `GET /api/afisha/films` - получить список всех фильмов
- `GET /api/afisha/films/:id/schedule` - получить расписание сеансов для фильма

### Заказы
- `POST /api/afisha/order` - создать новый заказ

## 🧪 Тестирование

### Backend тесты
```bash
cd backend
npm run test          # Unit тесты
npm run test:cov      # С покрытием кода
npm run test:e2e      # E2E тесты
```

### Frontend тесты
```bash
cd frontend
npm run test
```

## 🏗 Сборка для production

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend
```bash
cd frontend
npm run build
```

## 📦 Docker

### Сборка образов
```bash
docker-compose build
```

### Запуск контейнеров
```bash
docker-compose up -d
```

### Остановка контейнеров
```bash
docker-compose down
```

## 🚢 CI/CD Деплой

Проект настроен для автоматического деплоя через CI/CD pipeline. Процесс включает в себя автоматическую сборку, тестирование и развертывание приложения.

### Процесс CI/CD

Pipeline состоит из следующих этапов:

1. **Lint** - проверка кода линтером
2. **Test** - запуск unit и e2e тестов
3. **Build** - сборка Docker образов для backend и frontend
4. **Deploy** - развертывание на production сервер


### Настройка секретов

Для работы CI/CD необходимо настроить следующие секреты/переменные:

**GitHub Actions Secrets:**
- `DOCKER_REGISTRY` - адрес Docker registry
- `DOCKER_USERNAME` - имя пользователя Docker registry
- `DOCKER_PASSWORD` - пароль Docker registry
- `SERVER_HOST` - IP адрес или домен сервера
- `SERVER_USER` - пользователь для SSH подключения
- `SSH_PRIVATE_KEY` - приватный SSH ключ

**GitLab CI Variables:**
- `CI_REGISTRY` - адрес GitLab Container Registry
- `CI_REGISTRY_USER` - пользователь registry
- `CI_REGISTRY_PASSWORD` - пароль registry
- `SERVER_HOST` - адрес сервера
- `SERVER_USER` - пользователь SSH
- `SSH_PRIVATE_KEY` - приватный SSH ключ

### Деплой на сервер

После успешной сборки образов, деплой выполняется автоматически:

1. Образы загружаются в Docker registry
2. На production сервере выполняется `docker-compose pull`
3. Контейнеры перезапускаются с новыми образами
4. Выполняется очистка неиспользуемых Docker ресурсов

### Ручной деплой

Если автоматический деплой не настроен, можно выполнить деплой вручную:

```bash
# На сервере
cd /path/to/project
docker-compose pull
docker-compose up -d --build
docker system prune -f
```

## 🔧 Дополнительные команды

### Backend
- `npm run lint` - проверка кода линтером
- `npm run format` - форматирование кода
- `npm run start:debug` - запуск в режиме отладки

### Frontend
- `npm run lint` - проверка кода линтером
- `npm run storybook` - запуск Storybook
- `npm run preview` - предпросмотр production сборки

## 📚 Дополнительная информация

- Проект поддерживает работу с двумя типами БД: PostgreSQL и MongoDB
- Реализованы различные типы логгеров в зависимости от окружения
- Frontend использует компонентный подход с Storybook для разработки UI
- Приложение готово к развертыванию в production с использованием Docker

## 👥 Авторы

Проект разработан в рамках обучения на Яндекс Практикум.

## 📄 Лицензия

UNLICENSED

