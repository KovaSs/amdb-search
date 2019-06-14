import React from 'react';
import ReactDOM from 'react-dom';
import store from './store';
import { Provider } from 'react-redux';
import './index.scss';
import "antd/dist/antd.css";
import App from './components/App';

const AppWrapper = () => {
  return(
    <Provider store={store}>
      <App />
    </Provider>
  )
}

ReactDOM.render(<AppWrapper />, document.getElementById('root'));

