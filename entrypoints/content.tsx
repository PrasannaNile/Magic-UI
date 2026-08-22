import ReactDOM from 'react-dom/client';
import React from 'react';
import { ReaderOverlay } from './components/ReaderOverlay';

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    let uiInstance: any = null;

    async function toggleOverlay() {
      if (uiInstance) {
        uiInstance.remove();
        uiInstance = null;
        return;
      }

      uiInstance = await createShadowRootUi(ctx, {
        name: 'magic-ui-overlay',
        position: 'inline',
        anchor: 'body',
        append: 'last',
        onMount(container) {
          const root = ReactDOM.createRoot(container);
          root.render(
            <ReaderOverlay
              onClose={() => {
                if (uiInstance) {
                  uiInstance.remove();
                  uiInstance = null;
                }
              }}
            />
          );
          return root;
        },
        onRemove(root) {
          root?.unmount();
        },
      });

      uiInstance.mount();
    }

    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.type === 'TOGGLE_MAGIC_MODE') {
        toggleOverlay();
        sendResponse({ status: 'toggled' });
      }
      return true;
    });
  },
});