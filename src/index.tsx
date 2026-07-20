import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/es/locale/ru_RU'
import moment from 'moment'
import store, { runSagas } from './store';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { setupMocks, mocksReady } from './api/mocks';
import 'moment/locale/ru'
import './index.scss';
import "antd/dist/antd.css";
// import { base } from './base';

setupMocks()
moment.locale('ru')

class AppWrapper extends React.Component {
  render() {
    return(
      <Provider store={store}>
        <ConfigProvider locale={ruRU}>
          <App />
        </ConfigProvider>
      </Provider>
    )
  }
}

mocksReady().then(() => {
  runSagas()
  ReactDOM.render(<AppWrapper />, document.getElementById('root'))
})

serviceWorker.unregister();