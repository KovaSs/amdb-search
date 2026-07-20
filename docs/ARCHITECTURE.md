# Архитектура AS-Check

**AS-Check** — внутренний инструмент для проверки контрагентов и сопровождения банковских гарантий. Разработан для сотрудников безопасности банка.

---

## Содержание

1. [Назначение](#1-назначение)
2. [Стек](#2-стек)
3. [Структура проекта](#3-структура-проекта)
4. [Модули](#4-модули)
   - 4.1 [OpenBill (Открытие счёта)](#41-openbill-открытие-счёта)
   - 4.2 [EBG (Электронные банковские гарантии)](#42-ebg-электронные-банковские-гарантии)
   - 4.3 [CreditConveyor (Кредитный конвейер)](#43-creditconveyor-кредитный-конвейер)
   - 4.4 [EarlyWarningSystem (Система раннего предупреждения)](#44-earlywarningsystem-система-раннего-предупреждения)
   - 4.5 [StopListSearch (Поиск по стоп-листам)](#45-stoplistsearch-поиск-по-стоп-листам)
5. [API и бэкенд](#5-api-и-бэкенд)
6. [Управление состоянием](#6-управление-состоянием)
7. [Мок-сервер](#7-мок-сервер)
8. [Сборка и деплой](#8-сборка-и-деплой)
9. [CI](#9-ci)

---

## 1. Назначение

Приложение автоматизирует процессы комплаенс-проверки:

- **Проверка контрагентов** — поиск компании по ИНН, получение выписки из ЕГРЮЛ/ЕГРИП, проверка стоп-листов, риск-факторов, исполнительных производств, санкций
- **Идентификация** — идентификация физических лиц (руководителей, учредителей, бенефициаров)
- **Полная проверка (Croinform)** — комплексная проверка по базам Croinform с построением связей
- **Электронные банковские гарантии** — очередь заявок с присвоением ответственному сотруднику, проверка заявителя, связанных лиц и документов, акцепт/возврат
- **Мониторинг стоп-листов** — поиск по белой (активные) и чёрной (скрытые) базам стоп-листов ЦБ, Росфинмониторинга, ФНС и других ведомств

---

## 2. Стек

| Компонент | Версия |
|-----------|--------|
| React | 17.0.2 |
| Redux | 4.x |
| Redux-Saga | 1.0.5 |
| reselect | 4.x |
| Immutable.js | 4.0.0-rc.12 |
| Ant Design | 3.22.0 |
| React Router | 4.x |
| connected-react-router | ^6.5.2 |
| TypeScript | 4.9 |
| SCSS (dart-sass) | ^1.70.0 |
| lodash | ^4.17.15 |
| moment | ^2.24.0 |
| MSW | 2.15.0 (dev, мок-режим) |

---

## 3. Структура проекта

```
src/
├── api/
│   └── mocks/                  # MSW-моки для разработки без BE
│       ├── index.ts            # setupMocks() — точка входа
│       ├── config.ts           # ключ включения, задержка
│       ├── utils.ts            # sleep(), генераторы company_info
│       ├── data/index.ts       # импорт существующих JSON-моков EBG
│       ├── generators/         # генераторы тестовых данных
│       │   └── stopListData.ts # стоп-листы
│       └── handlers/           # MSW-обработчики эндпоинтов
│           ├── index.ts        # сборка всех handlers
│           ├── openBill.ts     # otkrytie_scheta.pl (11 type'ов)
│           ├── stopList.ts     # 4 эндпоинта стоп-листов
│           ├── ebg.ts          # EBG очередь/статусы/детали
│           ├── fkdo.ts         # документы
│           ├── ews.ts          # система раннего предупреждения
│           └── viewer.ts       # HTML-заглушки для iframe/ssylok
├── components/
│   ├── App/                    # корневой компонент (Layout)
│   ├── ContentContainer/       # роутинг и страницы
│   │   ├── OpenBill/           # открытие счёта
│   │   ├── ElectronicBankGarantees/  # ЕБГ
│   │   ├── CreditConveyor/     # кредитный конвейер
│   │   ├── EarlyWarningSystem/ # система раннего предупреждения
│   │   ├── StopListSearch/     # поиск по стоп-листам
│   │   ├── MainPage/           # главная страница
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
│   ├── index.ts                # создание store, запуск саг
│   ├── rootReduсer.ts          # корневой reducer
│   ├── rootSaga.ts             # корневая saga
│   └── mock.ts                 # начальное состояние companyResponse
├── services/
│   ├── api.ts                  # API-клиент (fetch + CGI)
│   ├── utils.ts                # утилиты и трансформеры (TransformData)
│   ├── fields.ts               # маппинг полей ЮЛ/ИП (fieldsArr)
│   └── reports.js              # генерация HTML-отчётов
├── config.ts                   # настройки серверов
├── antd-override.d.ts          # типы antd (обход совместимости с TS 4)
├── index.tsx                   # точка входа
└── index.scss                  # глобальные стили
```

---

## 4. Модули

### 4.1 OpenBill (Открытие счёта)

**Маршрут:** `/open-bill`

Базовый модуль проверки контрагента.

**Flow:**
1. Пользователь вводит ИНН (10 цифр для ЮЛ, 12 для ИП)
2. Сага `loadCompanyInfoSaga` вызывает `API.getLoadCompanyInfo(inn, digest_type=2)`
3. Полученные данные трансформируются через `trasform.updateComSrc` (ЮЛ) или `trasform.updateIPComSrc` (ИП)
4. После загрузки компании параллельно запускаются:
   - `loadAffilatesListSaga` — загрузка аффилированных лиц (учредители, руководители, акционеры)
   - `getStopListsUlSaga` — проверка компании по стоп-листам
   - `getDocumentsSaga` — загрузка приложенных документов
   - `getRiskFactorsFlSaga` — проверка риск-факторов для каждого руководителя

**API-вызовы:**

| Метод | type | digest_type |
|-------|------|-------------|
| `API.getLoadCompanyInfo` | `get_company_info` | 2 |
| `API.getAffilatesList` | `get_affilates` | 2 |
| `API.getRequestAffiliatesUl` | `get_affilates` | 2 |
| `API.getIdentifyUser` | `identify_user` | — |
| `API.getIdentifyUserInfo` | `request_user` | 2 |
| `API.getFsspInfo` | `fssp` | 2 |
| `API.getStopLists` | `stoplist` | 2 |
| `API.getStopListFl` | `stoplist` | 2 |
| `API.getRiskFactorsFl` | `digest_fl_search` | 2 |
| `API.getDigestList` | `digest` | 2 |
| `API.getAddRiskFactor` | `digest` | 2 |
| `API.editRiskFactorRequest` | `digest` | — |
| `API.getDeleteRiskFactor` | `digest` | — |
| `API.getAddRiskFactorFl` | `digest_fl_write` | 2 |
| `API.editRiskFactorFlRequest` | `digest_fl_edit` | 2 |
| `API.getDeleteRiskFactorFl` | `digest_fl_delete` | — |

**Компоненты:**
- `SearchCompanyInput` — форма поиска по ИНН
- `MainCompanyInfo` — заголовок с названием, ИНН, ОГРН, бейджами риск-факторов
- `CollapceContainer` — аккордеон с разделами:
  - **Общая информация** — поля компании (название, статус, адрес, ОКВЭД, капитал и т.д.), стоп-листы, арбитраж, ФНС, санкции
  - **Связанные лица** — менеджмент с кнопками идентификации и проверки
  - **Состав собственников** — учредители ФЛ/ЮЛ
  - **Бенефициары** — конечные бенефициары
- `DrawerContainer` — модальные окна:
  - `RiskInfoDrawer` — таблица риск-факторов с CRUD
  - `CompanyHistoryInfoDrawer` — история изменений
  - `CroinformDrawer` — результаты полной проверки (lists, HTML, FSSP, risk factors)
  - `RiskFactorsDigets` — управление риск-факторами ФЛ

---

### 4.2 EBG (Электронные банковские гарантии)

**Маршруты:** `/electronic-bank-garantees`, `/electronic-bank-garantees/:inn`

Модуль проверки заявок на банковские гарантии.

**Flow таблицы:**
1. `backgroundSyncSaga` — поллинг `API.getEbgSyncData()` каждые 10 секунд
2. Данные трансформируются через `trasform.updateEbgTable` → таблица с цветовыми статусами
3. Пользователь нажимает «Взять в работу» → сага:
   - `API.takeEbgItemToWork(inn)` — бронирование заявки
   - `API.getEbgDataItemInfo({ inn })` — получение полного JSON заявки
   - Навигация на страницу деталей

**Flow деталей:**
1. Загрузка информации о компании через `loadCompanyInfoSaga` (digest_type=4)
2. Обогащение данных из EBG JSON через `updateEbgJsonInfoSaga`:
   - `transform.updateEbgHeads` — создание записей руководителей из `client.management.companyPersons`
   - Автоматический запуск Croinform-проверки для каждого руководителя
3. Загрузка стоп-листов ЮЛ через `getStopListsUlSaga`
4. Загрузка документов через `getDocumentsSaga`
5. Загрузка риск-факторов через `loadDigestListUlSaga`

**Статусы очереди:**
- `"0"` — готово к проверке (доступно для взятия)
- `"1"` — объект в работе (назначен ответственный)
- `"2"` — акцептировано (проверка завершена)

**API-вызовы:**

| Метод | URL | Детали |
|-------|-----|--------|
| `getEbgSyncData` | `ebg_get_queues.pl` | синхронизация очереди |
| `takeEbgItemToWork` | `ebg_change_status.pl` | взятие в работу |
| `returnEbgItemToQueue` | `ebg_change_status.pl` | возврат в очередь |
| `acceptEbgItem` | `ebg_change_status.pl` | акцепт |
| `getEbgDataItemInfo` | `ebg_queue_detail.pl` | полный JSON заявки |

**Компоненты:**
- `TableContainer` — таблица очереди с поиском, статусами, таймером
- `EbgItem` — страница деталей заявки
- `SearchCompanyInput` — поиск с предзаполненным ИНН
- `CollapceContainer` — аккордеон с проверкой
- `DrawerContainer` — модальные окна (Crоinform, риск-факторы, документы, история)

---

### 4.3 CreditConveyor (Кредитный конвейер)

**Маршрут:** `/credit-conveyor`

Упрощённый модуль проверки контрагентов.

**Flow:**
1. Пользователь вводит ИНН или название компании
2. Прямой `fetch()` к `otkrytie_scheta.pl` с `type: 'get_company_info'`
3. Данные трансформируются через `trasform.updateComSrc`
4. Отображается информация о компании

**Отличия от OpenBill:**
- Использует прямой `fetch()` в saga, а не через `API`-класс
- Только базовый поиск (нет полной проверки, идентификации, аффилированных лиц)
- Не имеет собственных стоп-листов, риск-факторов и документов (используются общие трансформы)
- Присутствует iframe-режим для legacy CGI-страницы

**Компоненты:**
- `CreditConveyor` — основная страница с переключателем «новая/старая версия»
- `SearchCompanyInput` — форма поиска
- `CollapceContainer` — аккордеон с информацией о компании
- `DrawerContainer` — статическая заглушка (не реализована)

---

### 4.4 EarlyWarningSystem (Система раннего предупреждения)

**Маршрут:** `/early-warning-system`

Отображение индикаторов и метрик в iframe.

**Flow:**
1. Сага `getEwsDataSaga` вызывает `API.getEwsData({ method: 'mainData' })` с FormData
2. Ответ — массив объектов с `{ shortName, crmInd, regDate, sysDate, ... }`
3. Дублируется встроенным iframe на CGI-страницу `aprove_indicators_interface.pl`

**API-вызовы:**
- `POST /cgi-bin/serg/0/6/9/reports/274/aprove_indicators_server.pl` — получение данных
- iframe на `https://server/cgi-bin/serg/0/6/9/reports/274/aprove_indicators_interface.pl`

**Компоненты:**
- `EarlyWarningSystem` — страница с таблицей + iframe

---

### 4.5 StopListSearch (Поиск по стоп-листам)

**Маршрут:** `/stop-lists-search`

Поиск по белой (STOP_LIST_custom_search_all) и чёрной (STOP_LIST_deb_search_all) базам стоп-листов.

**Flow:**
1. Пользователь выбирает тип поиска: ФЛ/ИП (`type='fl'`) или ЮЛ (`type='ul'`)
2. Для ФЛ — поля: фамилия, имя, отчество, ИНН, дата рождения, серия/номер паспорта
3. Для ЮЛ — поля: наименование, ИНН, ОГРН
4. Для ФЛ — запросы параллельно в обе базы (белую и чёрную)
5. Для ЮЛ — запрос только в белую базу
6. Результаты сходятся через `trasform.customStopListSearch` в плоский массив:
   - Каждая строка = метаданные базы + данные записи + `search_request: "white"|"black"`
7. Таблица с колонками: ФИО, дата рождения, паспорт, ИНН, ОГРН, стоп-лист, дата записи, актуальность
8. Кнопка «Подробнее» — открывает CGI-просмотрщик записи

**API-вызовы:**

| URL | Тип | digest_type |
|-----|-----|-------------|
| `STOP_LIST_custom_search_all.pl` | fl / ul | — |
| `STOP_LIST_deb_search_all.pl` | fl | — |

**Компоненты:**
- `StopListSearch` — страница с формой поиска и таблицей результатов
- Встроенный переключатель ФЛ/ИП ↔ ЮЛ

---

## 5. API и бэкенд

### Эндпоинты

Все запросы — POST, тело — JSON (кроме EWS — FormData).

| URL | Модули | Формат ответа |
|-----|---------|----------|
| `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl` | OpenBill, EBG, CreditConveyor | JSON |
| `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta_fkdo.pl` | OpenBill, EBG | JSON / Blob |
| `/cgi-bin/serg/0/6/9/reports/276/ebg_get_queues.pl` | EBG | `{ data: [...] }` |
| `/cgi-bin/serg/0/6/9/reports/276/ebg_change_status.pl` | EBG | `{ status: { success } }` |
| `/cgi-bin/serg/0/6/9/reports/276/ebg_queue_detail.pl` | EBG | JSON (заявка) |
| `/cgi-bin/serg/0/6/9/reports/274/aprove_indicators_server.pl` | EWS | JSON (FormData input) |
| `/cgi-bin/serg/0/6/9/reports/253/STOP_LIST_custom_search.pl` | OpenBill, EBG | `{ Response: [...], Status }` |
| `/cgi-bin/ser4/0/6/9/reports/253/STOP_LIST_deb_search_2.pl` | OpenBill, EBG | `{ Response: [...], Status }` |
| `/cgi-bin/serg/0/6/9/reports/253/STOP_LIST_custom_search_all.pl` | StopListSearch | `{ Response: [...], Status }` |
| `/cgi-bin/ser4/0/6/9/reports/253/STOP_LIST_deb_search_all.pl` | StopListSearch | `{ Response: [...], Status }` |

### Конфигурация сервера

```typescript
// src/config.ts
config = {
  production: false,         // false = devServer, true = prodServer
  devServer: "https://10.96.205.191",
  prodServer: "https://10.96.51.138"
}
```

---

## 6. Управление состоянием

### Архитектура

```
Redux Store
├── openBill (ducks)      — состояние модуля открытия счета
├── creditConveyor (ducks) — состояние кредитного конвейера
├── EBG (monolith)         — состояние ЕБГ
├── earlyWarningSystem (ducks) — состояние СРП
├── stopListSearch (ducks) — состояние поиска стоп-листов
└── router (connected-react-router) — синхронизация с React Router
```

### Sagas

Каждый модуль использует redux-saga с watchers (`takeEvery` / `takeLatest`) для обработки асинхронных операций:

```
get_company_info → loadCompanyInfoSaga
  ├── updateComSrc (трансформ данных)
  ├── spawn → getStopListsUlSaga
  ├── call → updateEbgJsonInfoSaga (только EBG)
  └── call → loadDigestListUlSaga
```

### TransformData

Класс `TransformData` в `src/services/utils.ts` — центральный трансформер ответов API в Immutable-состояние. Основные методы:

- `updateComSrc` — маппинг `fieldsArr` на store для ЮЛ
- `updateIPComSrc` — маппинг `fieldsArrIP` для ИП
- `updateManagmentSrc` — обогащение heads данными из affiliatov
- `updateEbgHeads` — создание heads из EBG JSON
- `customStopListSearch` — схлопывание ответов стоп-листов в плоский массив
- `clearStopLists` / `clearStopListsArr` — очистка от пустых значений
- `clearRiskFactors` — очистка и аннотация риск-факторов
- `croinformInfoResponse` — обработка HTML + lists + vector
- `htmlTransform` — инлайн-стили для встраиваемых HTML-отчётов

---

## 7. Мок-сервер

Для разработки без реального бэкенда используется **MSW (Mock Service Worker)** v2.

### Включение

```bash
# Через env
REACT_APP_USE_MOCKS=true npm start

# Через localStorage (в консоли браузера)
localStorage.setItem('debugMocks', 'true')
```

### Архитектура моков

```
src/api/mocks/
├── index.ts              # setupMocks() — старт MSW, ожидание готовности
├── config.ts             # MOCKS_ENABLED_KEY, DEFAULT_DELAY
├── utils.ts              # sleep(), buildCompanyInfo(), buildIpCompanyInfo()
├── data/index.ts         # EBG mock JSON (alpico, ceventus, avantel)
├── generators/
│   └── stopListData.ts   # генерация записей стоп-листов
└── handlers/
    ├── openBill.ts       # otkrytie_scheta.pl (11 type'ов запросов)
    ├── stopList.ts       # 4 эндпоинта стоп-листов
    ├── ebg.ts            # очередь, статусы (stateful), детали
    ├── fkdo.ts           # документы
    ├── ews.ts            # система раннего предупреждения
    └── viewer.ts         # HTML-страницы для ссылок/iframe
```

### Особенности

- **Stateful EBG**: статусы очереди хранятся в `Map` в памяти, сбрасываются при перезагрузке страницы
- **Даты**: генерируются при импорте модуля, фиксируются до перезагрузки
- **Задержки**: 300ms (настраивается в `config.ts`)
- **Навигация**: при включении моков `config.devServer` переопределяется на `window.location.origin`, чтобы ссылки на CGI-просмотрщик вели на локальный MSW
- **Неперехваченные запросы**: пропускаются (`onUnhandledRequest: 'bypass'`)

### 14+ замоканных эндпоинтов

| Хендлер | Эндпоинты |
|---------|-----------|
| openBill | `otkrytie_scheta.pl` (get_company_info, get_affilates, identify_user, request_user, fssp, stoplist, digest, digest_fl_search, digest_fl_write, digest_fl_edit, digest_fl_delete) |
| stopList | `STOP_LIST_custom_search.pl`, `STOP_LIST_deb_search_2.pl`, `STOP_LIST_custom_search_all.pl`, `STOP_LIST_deb_search_all.pl` |
| fkdo | `otkrytie_scheta_fkdo.pl` (get_fkdo_info, fkdo_load_file) |
| ebg | `ebg_get_queues.pl`, `ebg_change_status.pl`, `ebg_queue_detail.pl` |
| ews | `aprove_indicators_server.pl` |
| viewer | `cgi-bin/serg/0/1/1/vi`, `cgi-bin/ser4/0/1/1/vi`, `aprove_indicators_interface.pl`, `konttur_focus_viewer_new4.pl` |

---

## 8. Сборка и деплой

### Команды

```bash
npm install          # установка зависимостей
npm start            # CRA dev-server (localhost:3000)
npm run build        # GENERATE_SOURCEMAP=false react-scripts build
npm run publish      # npm publish ./build
npm test             # react-scripts test (Jest)
```

### Production-сборка

```bash
GENERATE_SOURCEMAP=false react-scripts build
```

Сборка создаёт `build/` с оптимизированными статическими файлами. Dеплоится на Apache через `.htaccess` в поддиректории `/AS_CHECK`.

### Особенности сборки

- Sourcemaps отключены (`GENERATE_SOURCEMAP=false`)
- Консоль-логи подавляются в production при `config.production: true`
- Переменные окружения CRA: `REACT_APP_*`

---

## 9. CI

`.gitlab-ci.yml` — только стадия `test`, срабатывает на ветке `develop`.

```yaml
stages:
  - test
```
