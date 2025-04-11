import { createRoot } from 'react-dom/client'
import './index.css'
import * as React from "react";
import App from './App.tsx'
import { Provider } from "react-redux";
import { store } from "./Store/store.ts";

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
