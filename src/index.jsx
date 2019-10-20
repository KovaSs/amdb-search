import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/es/locale/ru_RU'
import moment from 'moment'
import store from './store';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import 'moment/locale/ru'
import './index.scss';
import "antd/dist/antd.css";

moment.locale('ru')

const AppWrapper = () => {
  return(
    <Provider store={store}>
      <ConfigProvider locale={ruRU}>
        <App />
      </ConfigProvider>
    </Provider>
  )
}

ReactDOM.render(<AppWrapper />, document.getElementById('root'));

serviceWorker.unregister();

