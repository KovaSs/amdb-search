/** Настройки приложения:
 * appName - тесктовый идентификатор приложения
 * devServer - адрес тестового сервера
 * prodServer - адрес промышленного сервера
 * api - метод формирования адреса статических запросов
 * Для propduction сборки для сервера, перевести свойство production: true  */
const config = {
  appName: "AS-Check",
  production: false,
  devServer: "https://10.96.205.191",
  prodServer: "https://10.96.51.138",
  api: function(){ return this.production ? this.prodServer : this.devServer}
}

export default config