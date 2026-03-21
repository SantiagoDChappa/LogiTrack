const btn   = document.getElementById('btn-theme');
const icon  = document.getElementById('theme-icon');
const label = document.getElementById('theme-label');
const html  = document.documentElement;

const saved = localStorage.getItem('theme') ?? 'light';
html.setAttribute('data-theme', saved);
applyTheme(saved);

btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';

    btn.classList.add('spinning');
    setTimeout(() => btn.classList.remove('spinning'), 400);

    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    applyTheme(next);
});

function applyTheme(theme) {
    if (theme === 'dark') {
        icon.textContent  = 'dark_mode';
        label.textContent = 'Modo oscuro';
    } else {
        icon.textContent  = 'light_mode';
        label.textContent = 'Modo claro';
    }
}
