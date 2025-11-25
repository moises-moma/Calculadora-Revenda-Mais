import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // ... Linha 6
const env = loadEnv(mode, '.', '');
return { // Corrigido (o 'return' já está certo)
  // === ESTA LINHA ESTÁ FALTANDO NO SEU ÚLTIMO COMMIT VISTO:
  base: './', 
  // =======================================================
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  // ... resto do arquivo
    // ...
// ...
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
