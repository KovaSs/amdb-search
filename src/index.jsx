import React from 'react';
import ReactDOM from 'react-dom';
import store from './store';
import { Provider } from 'react-redux';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import './index.scss';
import "antd/dist/antd.css";

const AppWrapper = () => {
  return(
    <Provider store={store}>
      <App />
    </Provider>
  )
}

ReactDOM.render(<AppWrapper />, document.getElementById('root'));

serviceWorker.unregister();

