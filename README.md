# Трекер подписок

Локальный однопользовательский трекер подписок. См. [`docs/PRD.md`](docs/PRD.md).

## Стек

- Next.js 14 (App Router) + TypeScript
- SQLite через `better-sqlite3`
- Tailwind CSS
- react-hook-form + zod
- date-fns
- Vitest (юнит-тесты для логики дат и нормализации)

## Запуск

```bash
npm install
npm run dev
```

Открыть http://localhost:3000.

Файл БД создаётся автоматически в `./data/subscriptions.db` при первом запуске и
исключён из git.

## Тесты

```bash
npm test
```

## Бэкап

Скопировать `./data/subscriptions.db`. Автобэкап — вне MVP.

## Структура

```
app/                Next.js App Router (страницы и server actions)
  page.tsx          Дашборд
  subscriptions/    CRUD подписок
  categories/       CRUD категорий
components/         React-компоненты
lib/
  db.ts             singleton better-sqlite3
  schema.sql        DDL
  repos/            доступ к БД
  domain/           normalize, next-date, dashboard
  validation.ts     zod-схемы форм
  format.ts         форматирование денег/дат
data/               БД (gitignored)
```
