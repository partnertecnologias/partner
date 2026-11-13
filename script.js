// Personalize o contato abaixo antes de publicar.
const CONTACT_EMAIL = 'contato@exemplo.com';
const contactLink = document.getElementById('contact-link');
contactLink.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Quero conversar sobre um projeto')}`;
document.getElementById('year').textContent = new Date().getFullYear();
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menu'); }));
