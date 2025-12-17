
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: [], // We can add a setup file later if needed
        include: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
        exclude: ['**/node_modules/**', '**/e2e/**'],
        alias: {
            '@': resolve(__dirname, './')
        }
    },
})
