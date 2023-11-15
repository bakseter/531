import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
        specPattern: '**/*.spec.ts',
        watchForFileChanges: false,
    },
    retries: {
        runMode: 5,
    },
});
