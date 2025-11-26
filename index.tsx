import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('[index] script loaded');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('[index] root element not found');
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);

    // load App dynamically so we can catch module/runtime errors separately
    import('./App')
      .then(({ default: AppModule }) => {
        root.render(
          <React.StrictMode>
            <AppModule />
          </React.StrictMode>
        );
        console.log('[index] React mounted App (dynamic import)');
      })
      .catch((err) => {
        console.error('[index] failed to load App module:', err);
        rootElement.innerHTML = `<div style="padding:20px;color:#900;background:#fee;border:1px solid #f99">` +
          `<h3>Erro ao carregar o App</h3><pre>${String(err)}</pre></div>`;
      });

  } catch (err) {
    console.error('[index] error mounting App:', err);
    rootElement.innerHTML = '<pre style="color:darkred">' + String(err) + '</pre>';
  }
}