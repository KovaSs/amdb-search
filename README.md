# AS-Check

Внутренний инструмент для проверки контрагентов и сопровождения банковских гарантий. Разработан для сотрудников безопасности банка.

## Функциональность

- **Открытие счета** — проверка компаний (ЮЛ/ИП) по ИНН: стоп-листы, риск-факторы, данные ФССП, идентификация, аффилированные лица
- **Электронные банковские гарантии (ЕБГ)** — очередь заявок, проверка объектов, управление статусами (взять в работу / вернуть / акцептировать)
- **Поиск по стоп-листам** — кастомный поиск по белой и чёрной базам (ФЛ/ЮЛ)
- **Система раннего предупреждения** — индикаторы кредитного конвейера

## Стек

React 17, Redux, Redux-Saga, reselect, Immutable.js 4 RC, Ant Design 3.22, React Router 4, connected-react-router, SCSS (dart-sass), TypeScript 4.9, MSW 2.15

## Быстрый старт

```bash
npm install
npm start              # dev-сервер (http://localhost:3000)
npm test               # тесты (Jest)
npm run build          # production-сборка → build/
npm run publish        # npm publish ./build
```

## Настройка

### Конфигурация API

`src/config.ts` — переключение между тестовым и промышленным сервером:

```ts
production: false   // тестовый сервер (devServer)
production: true    // промышленный сервер (prodServer)
```

Все запросы уходят на внутренние CGI-эндпоинты (`/cgi-bin/serg/...`).

### Мок-режим (MSW)

Для разработки без реального бэкенда:

```bash
REACT_APP_USE_MOCKS=true npm start
```

Или через `localStorage`:
```js
localStorage.setItem('debugMocks', 'true')
```

Все 14+ CGI-эндпоинтов замоканы: информация о компаниях, стоп-листы, очереди ЕБГ, система раннего предупреждения. Состояние очереди ЕБГ (взятие/возврат/акцепт) хранится в памяти и сбрасывается при перезагрузке страницы.

### Развёртывание

`.htaccess` — сервировка из поддиректории `/AS_CHECK` (Apache).

## CI

`.gitlab-ci.yml` — только `test` на ветке `develop`.

## Структура проекта

```
src/
├── components/
│   ├── App/                    # корневой компонент (Layout)
│   ├── ContentContainer/       # роутинг и страницы
│   │   ├── OpenBill/           # открытие счета
│   │   ├── ElectronicBankGarantees/  # ЕБГ
│   │   ├── CreditConveyor/     # кредитный конвейер
│   │   ├── EarlyWarningSystem/ # система раннего предупреждения
│   │   ├── StopListSearch/     # поиск по стоп-листам
│   │   ├── MainPage/           # главная
│   │   └── TestRequest/        # тестовый запрос
│   ├── SiderContainer/         # боковое меню
│   └── FooterContainer/        # подвал
├── store/
│   ├── ducks/                  # модули Redux (ducks pattern)
│   │   ├── openBill/
│   │   ├── creditConveyor/
│   │   ├── earlyWarningSystem/
│   │   ├── stopListSearch/
│   │   └── EBG.ts              # монолитный модуль (~1960 строк)
│   ├── index.ts                # создание store
│   ├── rootReduсer.ts
│   └── rootSaga.ts
├── api/
│   └── mocks/                  # MSW-моки для разработки
│       ├── index.ts            # setupMocks() — точка входа
│       ├── handlers/           # обработчики эндпоинтов
│       ├── generators/         # генераторы тестовых данных
│       └── data/               # импорт существующих JSON-моков
├── services/
│   ├── api.js                  # API-клиент (fetch + CGI)
│   ├── utils.js                # утилиты и трансформеры данных
│   ├── fields.js               # маппинг полей компаний
│   └── reports.js              # генерация HTML-отчётов
├── config.ts                   # настройки серверов
└── antd-override.d.ts          # типы antd (обход совместимости с TS 4)
```

## Особенности

- Ant Design 3.x — типы несовместимы с TypeScript 4.x, используются через переопределение `src/antd-override.d.ts`
- `strict: false` — в проекте свободно соседствуют JSX и TSX файлы
- Модуль EBG — монолитный `EBG.ts` (константы + action'ы + reducer + saga + селекторы в одном файле)
- MSW-моки в `src/api/mocks/` — для разработки без реального бэкенда
- Иммутабельное состояние: `window.store` доступен для отладки
- Консоль-логи подавляются в production при `config.production: true`
- Локализация: `ru_RU` (antd, moment)
