// Personalize o contato abaixo antes de publicar.
const CONTACT_EMAIL = 'contato@exemplo.com';
const contactLink = document.getElementById('contact-link');
contactLink.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Quero conversar sobre um projeto')}`;
document.getElementById('year').textContent = new Date().getFullYear();
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menu'); }));

// Identifica a superfície atrás do menu para alternar a cor do logotipo.
const siteHeader=document.querySelector('.header');
function updateHeaderContrast(){
  const y=Math.min(100,window.innerHeight*.14);
  const x=Math.min(28,window.innerWidth*.06);
  const sections=document.querySelectorAll('main > section');
  let active=null;
  for(const section of sections){const r=section.getBoundingClientRect();if(r.top<=y&&r.bottom>y){active=section;break;}}
  const dark=active&&(active.classList.contains('hero')||active.classList.contains('statement'));
  siteHeader.classList.toggle('on-light',!dark);
}
window.addEventListener('scroll',updateHeaderContrast,{passive:true});
window.addEventListener('resize',updateHeaderContrast);
updateHeaderContrast();


// Títulos: entrada escalonada de cima para baixo e interação suave por letra.
// Mantém spans de cor, quebras de linha e texto acessível.
(function setupTitleMotion(){
  const titles = document.querySelectorAll('.animated-title');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  titles.forEach(title => {
    const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    let count=0;
    nodes.forEach(node=>{
      const fragment=document.createDocumentFragment();
      const parts=node.textContent.match(/\S+|\s+/g)||[];
      parts.forEach(part=>{
        if(/^\s+$/.test(part)){fragment.appendChild(document.createTextNode(part));return;}
        const word=document.createElement('span');word.className='word';word.style.setProperty('--delay',`${Math.min(count++,22)*65}ms`);
        for(const ch of part){const letter=document.createElement('span');letter.className='letter';letter.textContent=ch;word.appendChild(letter);}
        fragment.appendChild(word);
      });
      node.replaceWith(fragment);
    });
  });
  if(reduced)return;
  document.documentElement.classList.add('js-motion');
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});
  },{threshold:0.12});
  titles.forEach(t=>observer.observe(t));
})();
