import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import {PersistGate} from 'redux-persist/integration/react';
import {persister, store} from './app/store.ts';
import {Provider} from 'react-redux';
import {addInterceptor} from './axiosApi.ts';
import {BrowserRouter} from 'react-router-dom';

addInterceptor(store);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persister}>
        <BrowserRouter>
          <App/>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
