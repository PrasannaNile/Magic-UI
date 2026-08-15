import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Magic UI',
    description: 'Transform cluttered webpages into clean, structured reading experiences.',
    version: '0.1.0',
    permissions: ['activeTab', 'storage', 'scripting'],
    host_permissions: ['<all_urls>'],
  },
});