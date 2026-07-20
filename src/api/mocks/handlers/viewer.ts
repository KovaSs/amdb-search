import { http, HttpResponse } from 'msw'

const buildViewerPage = (params: URLSearchParams): string => {
  const baseid = params.get('baseid') || ''
  const tableid = params.get('tableid') || ''
  const basename = params.get('basename') || ''
  const tablename = params.get('tablename') || ''
  const pk = params.get('pk') || ''
  const pkCol = params.get('pk_col') || ''

  return `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><title>Просмотр записи стоп-листа</title></head>
<body style="font-family:sans-serif;padding:20px">
  <h2>Просмотр записи стоп-листа</h2>
  <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse">
    <tr><td><b>База</b></td><td>${basename}</td></tr>
    <tr><td><b>Таблица</b></td><td>${tablename}</td></tr>
    <tr><td><b>ID записи</b></td><td>${pk}</td></tr>
    <tr><td><b>ID колонки</b></td><td>${pkCol}</td></tr>
    <tr><td><b>Источник</b></td><td>Мок-режим</td></tr>
    <tr><td><b>Дата</b></td><td>${new Date().toLocaleDateString('ru-RU')}</td></tr>
  </table>
  <p style="color:#888;font-size:12px">* Мок-режим: отображаются тестовые данные</p>
  <p><a href="javascript:window.close()">Закрыть</a></p>
</body>
</html>`
}

const buildEwsPage = (): string => `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><title>Система раннего предупреждения</title></head>
<body style="font-family:sans-serif;padding:20px">
  <h2>Система раннего предупреждения</h2>
  <p>Данные недоступны в мок-режиме.</p>
</body>
</html>`

const buildKonturPage = (): string => `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><title>Контур Фокус</title></head>
<body style="font-family:sans-serif;padding:20px">
  <h2>Контур Фокус</h2>
  <p>Данные недоступны в мок-режиме.</p>
</body>
</html>`

export const viewerHandlers = [
  http.get('*/cgi-bin/serg/0/1/1/vi', ({ request }) => {
    const url = new URL(request.url)
    return HttpResponse.html(buildViewerPage(url.searchParams))
  }),

  http.get('*/cgi-bin/ser4/0/1/1/vi', ({ request }) => {
    const url = new URL(request.url)
    return HttpResponse.html(buildViewerPage(url.searchParams))
  }),

  http.get('*/cgi-bin/serg/0/6/9/reports/274/aprove_indicators_interface.pl', () => {
    return HttpResponse.html(buildEwsPage())
  }),

  http.get('*/cgi-bin/serg/0/6/9/reports/276/konttur_focus_viewer_new4.pl', () => {
    return HttpResponse.html(buildKonturPage())
  }),
]
