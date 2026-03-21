// Mintlify custom scripts: hydrate the changelog-only thumbs widget.
(() => {
  const UP_ID = "feedback-thumbs-up";
  const DOWN_ID = "feedback-thumbs-down";

  const storageKeyForPage = (pagePath) =>
    `heyy:thumbsFeedback:${pagePath}`;

  const loadState = (pagePath) => {
    const raw = window.localStorage.getItem(storageKeyForPage(pagePath));
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (parsed === "up" || parsed === "down") return parsed;
      return null;
    } catch {
      return null;
    }
  };

  const saveState = (pagePath, value) => {
    window.localStorage.setItem(storageKeyForPage(pagePath), JSON.stringify(value));
  };

  const init = () => {
    const upBtn = document.getElementById(UP_ID);
    const downBtn = document.getElementById(DOWN_ID);
    if (!upBtn || !downBtn) return;

    const pagePath = window.location.pathname;
    const initial = loadState(pagePath);

    const setActive = (value) => {
      const upActive = value === "up";
      const downActive = value === "down";

      upBtn.dataset.active = upActive ? "true" : "false";
      downBtn.dataset.active = downActive ? "true" : "false";

      upBtn.setAttribute("aria-pressed", upActive ? "true" : "false");
      downBtn.setAttribute("aria-pressed", downActive ? "true" : "false");
    };

    setActive(initial);

    upBtn.addEventListener("click", () => {
      const next = "up";
      setActive(next);
      saveState(pagePath, next);
    });

    downBtn.addEventListener("click", () => {
      const next = "down";
      setActive(next);
      saveState(pagePath, next);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

