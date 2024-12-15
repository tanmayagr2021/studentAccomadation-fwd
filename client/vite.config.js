import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  server:{ // automatically goes to local host 3000
    proxy:{
      '/api':{
       target: 'http://localhost:5174',
       secure: false,
      },
    },
  },
  plugins: [react()],
});
