# Changelog

## 3.0.0 (текущая)

### Миграция на Node 20 + CRA 5 + полный TypeScript

#### Зависимости
- `react-scripts` 3.1.1 → 5.0.1 (webpack 4 → 5, CRA 5)
- `react` 16.8.4 → 17.0.2
- `react-redux` 6.0.1 → 7.2.9
- `typescript` 3.7 → 4.9
- `node-sass` → `sass` (dart-sass)
- `react-app-polyfill` удалён (CRA 5 не поддерживает IE)
- Команда `build` — кросс-платформенная (`GENERATE_SOURCEMAP=false`)
- `browserslist` обновлён до формата CRA 5

#### TypeScript-миграция
- Все `.js`/`.jsx` файлы переименованы в `.ts`/`.tsx` (~65 файлов)
- Добавлены типы в сервисы (`api`, `utils`, `fields`, `reports`)
- `antd-override.d.ts` — переопределение типов antd 3.x для совместимости с TS 4.x
- `@types/jest` добавлен для тестов

#### Исправленные баги (найдены при миграции)
- `"Content-Type"` был передан вне `headers` в fetch-запросе
- Опечатка `'canceble'` → `'cancelable'` в `MouseEventInit`
- `parseInt` получал `number` вместо `string` в валидации ИНН
- Сравнение `JSON.stringify(x) === []` (всегда false)
- `el.func` вместо `fieldItem.func` в `updateManagmentSrc` (мёртвая ветка кода)

#### Чистка
- Удалена мёртвая директория `EBG/` (duck-структура, не использовалась — source of truth `EBG.js`)
- `EBG.js` → `EBG.ts` (монолит, 1957 строк)
- `result.md`, `package-lock.json` добавлены в `.gitignore`

#### Документация
- `AGENTS.md` — инструкция для OpenCode-сессий
- `CHANGELOG.md` — история изменений
- `README.md` — обновлено с реальным описанием проекта

## 2.0.0

### Архитектура
- React 16.8 + Redux + Redux-Saga + reselect + Immutable.js 4 RC
- Ant Design 3.22 + React Router 4 + connected-react-router
- TypeScript 3.7 + SCSS (node-sass)
- Create React App 3 (react-scripts 3.1.1)
- Ducks pattern: `src/store/ducks/` — 5 модулей

### Модули
- **OpenBill (Открытие счёта)** — поиск и проверка ЮЛ/ИП: стоп-листы, риск-факторы, идентификация, аффилированные лица, ФССП, HTML-отчёты
- **EBG (Электронные банковские гарантии)** — таблица очереди, взятие в работу/возврат/акцепт, проверка связанных лиц и документов; монолитный `EBG.js` (1957 строк)
- **CreditConveyor (Кредитный конвейер)** — проверка контрагентов (базовый функционал)
- **EarlyWarningSystem (Система раннего предупреждения)** — индикаторы и метрики
- **StopListSearch (Поиск по стоп-листам)** — кастомный поиск по белой и чёрной базам

### API
- Внутренние CGI-эндпоинты (`/cgi-bin/serg/...`, `/cgi-bin/ser4/...`)
- POST-запросы, `mode: 'cors'`, `credentials: 'include'`
- Переключение dev/prod через `src/config.ts`
- Опциональный Firebase-бэкенд (через `REACT_APP_USE_FIREBASE_API`)

### Инфраструктура
- Deploy: Apache, `.htaccess`, поддиректория `/AS_CHECK`
- CI: GitLab CI, только `test` на `develop`
- Единственный тест: `MainCompanyInfo/index.test.js` (заглушка)
- `GENERATE_SOURCEMAP=false` — карты кода отключены в production
- `window.store` — store доступен в консоли для отладки
- Консоль-логи подавляются в production

## 1.0.0 — Миграция на TypeScript

- Переход с JavaScript на TypeScript (постепенно, модуль за модулем)
- OpenBill: первый модуль, переведённый на TS (store + компоненты)
- CreditConveyor, earlyWarningSystem, stopListSearch: перевод store на TS
- EBG: начат перевод на TS, duck-структура создана, но не завершена
- Удалён старый JS store

## 0.10.0 — Внедрение Sagas

- Замена `redux-thunk` на `redux-saga` (1.0.5)
- Вынос асинхронной логики из компонентов в саги
- Удалён `redux-logger`

## 0.9.0 — Firebase

- Добавлена поддержка Firebase (firebase 7.x)
- `src/base.ts` — конфигурация через `REACT_APP_FIREBASE_*`
- Возможность переключения между прямыми CGI-запросами и Firebase

## 0.8.0 — Immutable.js

- State переведён на Immutable.js 4 RC (`Record`, `Map`, `OrderedMap`)
- Селекторы преобразованы для работы с Immutable

## 0.7.0 — Ducks pattern

- Store реорганизован в ducks-модули
- Каждый модуль: `{actions, constants, reducer, saga, selectors}`
- `connected-react-router` для синхронизации роутинга с Redux

## 0.6.0 — Сборка и деплой

- Create React App (react-scripts 3.x)
- Настройка .htaccess для Apache (/AS_CHECK)
- CI в GitLab

## 0.5.0 — Credit Conveyor + Stop Lists

- Модуль кредитного конвейера
- Поиск по стоп-листам (чёрная и белая базы ФНС)
- Отображение риск-факторов

## 0.4.0 — EBG

- Модуль электронных банковских гарантий
- Таблица очереди заявок, смена статусов

## 0.3.0 — Ant Design

- Подключён UI-фреймворк Ant Design 3.x
- Компоненты: Collapse, Drawer, Badge, Table, Breadcrumb

## 0.2.0 — Open Bill

- Поиск компаний по ИНН
- Отображение основной информации, руководства, учредителей
- Арбитраж, ФССП, стоп-листы

## 0.1.0 — Инициализация

- Начальная структура React-приложения
- Роутинг, боковое меню, макет страницы
