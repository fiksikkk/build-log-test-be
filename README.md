# Build Log Test Backend

Бэкенд для тестового задания "Журнал работ на строительном объекте".

## Стек

- `NestJS` как основной backend framework
- `TypeScript` для типобезопасности
- `PostgreSQL` как база данных
- `Prisma` как ORM и инструмент миграций
- `Docker Compose` для локального запуска и деплоя на сервер
- `Swagger` для ручной проверки API

Выбор такой связки дает быстрый старт, понятную модульную структуру и удобную работу с БД через миграции и типизированный клиент.

## Что реализовано

- справочник видов работ: `GET /api/work-types`
- справочник единиц измерения: `GET /api/measurement-units`
- CRUD записей журнала:
  - `GET /api/work-log-entries`
  - `GET /api/work-log-entries/:id`
  - `POST /api/work-log-entries`
  - `PATCH /api/work-log-entries/:id`
  - `DELETE /api/work-log-entries/:id`
- фильтрация по дате через `dateFrom` и `dateTo`
- сортировка по дате через `sortOrder`
- Swagger UI: `GET /api/docs`

## Запуск локально без Docker

1. Установить зависимости:

```bash
pnpm install
```

2. Создать `.env` на основе `.env.example`

Для запуска без Docker поменять хост в `DATABASE_URL` с `db` на `localhost`.

3. Поднять PostgreSQL любым удобным способом и указать `DATABASE_URL`

4. Сгенерировать Prisma Client и применить миграции:

```bash
pnpm prisma:generate
pnpm prisma:migrate --name init
pnpm prisma:seed
```

5. Запустить приложение:

```bash
pnpm start:dev
```

## Запуск через Docker Compose

1. Создать `.env`:

```bash
cp .env.example .env
```

2. Поднять сервисы:

```bash
docker compose up -d --build
```

После запуска:

- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api/docs`

## Примечания по деплою на сервер

`Docker Compose` подходит и для локальной разработки, и для развертывания на своем сервере, если инфраструктура простая и не нужен оркестратор.

Типовой сценарий:

```bash
git pull
docker compose up -d --build
```

Что происходит при старте `app`:

- контейнер ждет доступности PostgreSQL;
- запускает `prisma migrate deploy`;
- запускает `prisma db seed`;
- после этого стартует NestJS-приложение.

Это удобно для первого деплоя и для обновлений схемы без ручного входа в контейнер.

## Production notes

- для сервера обязательно замени `POSTGRES_PASSWORD`
- если база будет жить вне `docker compose`, достаточно поменять `DATABASE_URL`
- если не хочешь публиковать PostgreSQL наружу, убери `POSTGRES_PORT` из `docker-compose.yml`
- для reverse proxy удобно проксировать только `PORT`, например через Nginx или Caddy
- Swagger в production сейчас остается включенным; при желании его можно ограничить по `NODE_ENV`

## GitHub Actions deploy

В репозитории есть workflow для деплоя на VM с Docker:

- ветка деплоя: `production`
- workflow: `.github/workflows/deploy.yml`
- проект загружается в `/opt/build-log-test-be`
- на сервере выполняется `docker compose up -d --build`

Что нужно один раз подготовить на сервере:

1. Установить `docker` и `docker compose`
2. Убедиться, что deploy-user может запускать `docker compose`
3. Создать директорию `/opt/build-log-test-be`
4. Создать `/opt/build-log-test-be/.env` вручную

Пример production `.env` на сервере:

```env
PORT=3000
NODE_ENV=production

POSTGRES_DB=build_log
POSTGRES_USER=postgres
POSTGRES_PASSWORD=change_me
POSTGRES_PORT=5432

DATABASE_URL=postgresql://postgres:change_me@db:5432/build_log
```

Какие GitHub Secrets нужны:

- `SERVER_HOST`
- `SERVER_USER`
- `SERVER_SSH_KEY`
- `SERVER_PORT`

## Переменные окружения

- `PORT`
- `NODE_ENV`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_PORT`
- `DATABASE_URL`
