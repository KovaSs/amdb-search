import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './store/reduсers';
import './index.scss';
import "antd/dist/antd.css";
import App from './components/App/App';

const store = createStore(rootReducer)

const AppWrapper = () => {
  return(
    <Provider store={store}>
      <App />
    </Provider>
  )
}

ReactDOM.render(<AppWrapper />, document.getElementById('root'));

