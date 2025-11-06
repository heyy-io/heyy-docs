function loadHeyy() {
      window.heyySettings = { widgetId: "JlIknkx9lv7L117y", baseUrl: "http://localhost:3050" };

      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.src = 'https://assets.heyy.io/live-chat-dev/live-chat.js';
      document.head.appendChild(s);
    }
    window.addEventListener('load', function () {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(loadHeyy);
      } else {
        setTimeout(loadHeyy, 3000);
      }
});