
const menuButton = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
if (menuButton && navLinks) {
  menuButton.addEventListener('click', () => navLinks.classList.toggle('open'));
}
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
