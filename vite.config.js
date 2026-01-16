import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    base: '/BIZ/',
    server: {
        port: 8001,
        open: true
    },
    build: {
        outDir: 'dist',
        target: 'esnext',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                login: resolve(__dirname, 'login.html'),
                architecture: resolve(__dirname, 'enterprise_architecture_2027.html'),
                mcparchitecture: resolve(__dirname, 'servicenow_mcp_architecture_2027.html')
            }
        }
    }
})
