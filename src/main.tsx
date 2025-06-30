import { createRoot } from 'react-dom/client'
import './index.css'
import * as React from "react";
import App from './App.tsx'
import { Provider } from "react-redux";
import { store } from "./Store/store.ts";
import 'swiper/css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';


const root = createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)

serviceWorkerRegistration.register();
