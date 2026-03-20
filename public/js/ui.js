const userSection  = document.querySelector('.top-header .user');
const userDropdown = document.getElementById('user-dropdown');

userSection.addEventListener('click', () => {
    const isOpen = userDropdown.classList.toggle('open');
    userSection.classList.toggle('open', isOpen);
});

document.addEventListener('click', (e) => {
    if (!userSection.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.remove('open');
        userSection.classList.remove('open');
    }
});
