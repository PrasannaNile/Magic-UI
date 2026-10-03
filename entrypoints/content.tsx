import ReactDOM from 'react-dom/client';
import React from 'react';
import { Readability } from '@mozilla/readability';
import { ReaderOverlay } from './components/ReaderOverlay';
import type { RedesignResponse } from '../src/types/types';

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    let uiInstance: any = null;
    let rootInstance: ReactDOM.Root | null = null;

    function renderUI(data: RedesignResponse | null, loading: boolean, error: string | null) {
      rootInstance?.render(
        <ReaderOverlay
          data={data}
          loading={loading}
          error={error}
          onClose={() => {
            uiInstance?.remove();
            uiInstance = null;
            rootInstance = null;
          }}
        />
      );
    }

    async function processAndDisplay() {
      // 1. Mount container in loading state
      if (!uiInstance) {
        uiInstance = await createShadowRootUi(ctx, {
          name: 'magic-ui-overlay',
          position: 'inline',
          anchor: 'body',
          append: 'last',
          onMount(container) {
            rootInstance = ReactDOM.createRoot(container);
            renderUI(null, true, null);
            return rootInstance;
          },
          onRemove() {
            rootInstance?.unmount();
          },
        });
        uiInstance.mount();
      }

      try {
        // 2. Parse active page DOM
        const documentClone = document.cloneNode(true) as Document;
        const reader = new Readability(documentClone);
        const article = reader.parse();

        const rawText = article?.textContent || document.body.innerText;
        const pageTitle = article?.title || document.title;

        // 3. Request structured layout via background service worker
        const response: any = await chrome.runtime.sendMessage({
          type: 'FETCH_REDESIGN',
          payload: {
            url: window.location.href,
            title: pageTitle,
            raw_text: rawText,
          },
        });

        if (!response?.success) {
          throw new Error(response?.error || 'Failed to fetch redesign from server');
        }

        renderUI(response.data, false, null);
      } catch (err: any) {
        renderUI(null, false, err.message || 'Failed to redesign webpage.');
      }
    }

    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.type === 'TOGGLE_MAGIC_MODE') {
        if (uiInstance) {
          uiInstance.remove();
          uiInstance = null;
          rootInstance = null;
        } else {
          processAndDisplay();
        }
        sendResponse({ status: 'triggered' });
      }
      return true;
    });
  },
});