import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    build: {
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,  // Supprime tous les console.log()
                drop_debugger: true, // Supprime tous les debugger;
            }
        }
    },
    plugins: [
        laravel({
            input: [
                'resources/css/app.css', 'resources/js/app.js'
            
            ],
            refresh: true,
        }),
        react(),
    ],
    resolve: { 
        alias: {
            '@': '/resources/js',
        },
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        //cors: true,
        watch: {
            usePolling: true,
        },
        hmr: {
            host: 'localhost',
        },
        // cors: {
        //     origin: [
        //         'http://projectmanager.demo',
        //         'http://localhost',
        //         //'http://localhost:5173',
                
        //     ],
        //     credentials: true
        // }
    },
});
