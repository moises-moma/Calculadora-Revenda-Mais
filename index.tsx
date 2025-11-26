import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('[index] script loaded');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('[index] root element not found');
} else {
  // Immediate visible fallback so the page isn't blank
  rootElement.innerHTML = '<div id="app-fallback" style="padding:20px;font-family:Inter,system-ui,Arial;color:#111">Carregando aplicação... (aguarde)</div>';

  // Global error handlers to show uncaught errors/rejections in the DOM for easier debugging
  window.addEventListener('error', (e) => {
    console.error('[window.error]', e.error || e.message, e);
    const msg = (e.error && e.error.stack) || e.message || String(e);
    if (rootElement) rootElement.innerHTML = `<div style="padding:20px;color:#900;background:#fee;border:1px solid #f99"><h3>Erro não tratado</h3><pre>${msg}</pre></div>`;
  });
  window.addEventListener('unhandledrejection', (e) => {
    console.error('[unhandledrejection]', e.reason);
    const msg = (e.reason && e.reason.stack) || String(e.reason);
    if (rootElement) rootElement.innerHTML = `<div style="padding:20px;color:#900;background:#fee;border:1px solid #f99"><h3>Promise rejeitada</h3><pre>${msg}</pre></div>`;
  });

  try {
    const root = ReactDOM.createRoot(rootElement);

    // load App dynamically so we can catch module load errors separately
    import('./App')
      .then(({ default: AppModule }) => {
        // clear fallback before rendering
        if (document.getElementById('app-fallback')) document.getElementById('app-fallback')!.remove();
        root.render(
          <React.StrictMode>
            <AppModule />
          </React.StrictMode>
        );
        console.log('[index] React mounted App (dynamic import)');
      })
      .catch((err) => {
        console.error('[index] failed to load App module:', err);
        rootElement.innerHTML = `<div style="padding:20px;color:#900;background:#fee;border:1px solid #f99"><h3>Erro ao carregar o App</h3><pre>${String(err)}</pre></div>`;
      });

  } catch (err) {
    console.error('[index] error mounting App:', err);
    rootElement.innerHTML = '<pre style="color:darkred">' + String(err) + '</pre>';
  }
}