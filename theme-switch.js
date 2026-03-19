(function () {
  const body = document.body;
  const toggle = document.getElementById('theme-toggle');
  if (!toggle || !body) return;

  const stored = localStorage.getItem('theme');
  const prefersDark =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const initialTheme = stored || (prefersDark ? 'dark' : 'light');
  body.dataset.theme = initialTheme;

  function setTheme(nextTheme) {
    body.dataset.theme = nextTheme;
    localStorage.setItem('theme', nextTheme);
  }

  toggle.addEventListener('click', () => {
    const current = body.dataset.theme === 'light' ? 'light' : 'dark';
    setTheme(current === 'light' ? 'dark' : 'light');
  });
})();

