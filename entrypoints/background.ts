import { defineBackground } from 'wxt/utils/define-background';

export default defineBackground(() => {
  // The service worker keeps no learner data. Content scripts own checkpoint state.
});
