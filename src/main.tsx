import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

// 🔥 Bootstrap siempre debe ir PRIMERO
import 'bootstrap/dist/css/bootstrap.min.css';

// Luego Tailwind (que usa @tailwind base, components, utilities)
import './index.css';
import './satoshi.css';

import { store } from './store/store';
import { Provider } from 'react-redux';

// DesignProvider
import { DesignProvider } from './context/DesignContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}> 
      <DesignProvider>   {/* 🔥 Inyectamos aquí el selector global */}
        <Router>
          <App />
        </Router>
      </DesignProvider>
    </Provider>
    
  </React.StrictMode>
);
