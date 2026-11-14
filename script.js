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
  },{threshold:0,rootMargin:'-45% 0px -45% 0px'});
  titles.forEach(t=>observer.observe(t));
})();

// Entradas de conteúdo: só começam quando cada bloco aparece na viewport.
// Não interfere nas transições internas do carrossel nem no hover das letras.
(function setupScrollReveals(){
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduced || !('IntersectionObserver' in window))return;
 const selectors=[
  '.intro-footer', '.showcase-stage', '.showcase-controls',
  '.services .section-label', '.services .section-heading', '.service',
  '.statement-inner', '.projects .section-label', '.projects .section-heading',
  '.project-card', '.process .section-label', '.process-grid > h2',
  '.steps > div', '.contact-inner', '.contact-shape', '.footer-top', '.footer-bottom'
 ];
 const elements=[...document.querySelectorAll(selectors.join(','))];
 elements.forEach(el=>el.classList.add('scroll-reveal'));
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
  });
 },{threshold:0,rootMargin:'-45% 0px -45% 0px'});
 elements.forEach(el=>observer.observe(el));
})();

// Showcase: controles para navegar entre as artes demonstrativas.
(()=>{
 const track=document.getElementById('showcase-track');if(!track)return;
 const slides=[...track.querySelectorAll('.showcase-preview')];
 const prev=document.getElementById('showcase-prev'),next=document.getElementById('showcase-next'),pause=document.getElementById('showcase-pause');
 let active=2,playing=true,entered=false;
 const showcaseSection=track.closest('.showcase');
 const showcaseObserver=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){entered=true;showcaseObserver.disconnect();}},{threshold:.12});
 showcaseObserver.observe(showcaseSection);
 function render(){
  const mobile=window.innerWidth<=700;
  slides.forEach((slide,i)=>{
   let delta=i-active;
   if(delta>2)delta-=slides.length;
   if(delta< -2)delta+=slides.length;
   const distance=Math.abs(delta);
   const x=delta===0?0:(delta>0?1:-1)*(mobile?(distance===1?190:325):(distance===1?355:630));
   const scale=mobile?(distance===0?.68:distance===1?.49:.34):(distance===0?1.08:distance===1?.78:.55);
   slide.style.setProperty('--slide-x',x+'px');
   slide.style.setProperty('--slide-y',(distance===0?-9:distance===1?16:30)+'px');
   slide.style.setProperty('--slide-scale',scale);
   slide.style.setProperty('--slide-opacity',distance===2?.90:1);
   slide.style.setProperty('--slide-layer',4-distance);
   slide.classList.toggle('is-active',distance===0);
   slide.setAttribute('aria-hidden',distance===2?'true':'false');
  });
 }
 function move(step){active=(active+step+slides.length)%slides.length;render()}
 prev?.addEventListener('click',()=>move(-1));next?.addEventListener('click',()=>move(1));
 pause?.addEventListener('click',()=>{playing=!playing;pause.textContent=playing?'Ⅱ':'▶';pause.setAttribute('aria-label',playing?'Pausar animação':'Retomar animação')});
 window.addEventListener('resize',render,{passive:true});render();
 if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){setInterval(()=>{if(entered&&playing&&document.visibilityState==='visible')move(1)},4500)}
})();

// Card central: digitação letra a letra, pausa, apagamento e próxima mensagem.
(()=>{
 const heading=document.querySelector('.showcase-typewriter');
 if(!heading)return;
 const output=heading.querySelector('.typewriter-text');
 const messages=[
  {text:'Alavanque seu\nnegócio\ncom a Partner',highlight:'com a Partner'},
  {text:'Sites',highlight:'Sites'},
  {text:'Landing Pages',highlight:'Landing Pages'},
  {text:'E-commerces',highlight:'E-commerces'},
  {text:'Sistemas',highlight:'Sistemas'}
 ];
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduced){output.textContent=messages[0].text;heading.setAttribute('aria-label',messages[0].text.replace(/\n/g,' '));return;}
 let index=0,chars=0,removing=false;
 function render(){
  const {text,highlight}=messages[index];
  const shown=text.slice(0,chars);
  const at=text.lastIndexOf(highlight);
  output.replaceChildren();
  if(at>=0&&shown.length>at){
   output.append(document.createTextNode(shown.slice(0,at)));
   const green=document.createElement('span');green.className='typed-green';green.textContent=shown.slice(at);output.append(green);
  }else output.textContent=shown;
  heading.setAttribute('aria-label',text.replace(/\n/g,' '));
 }
 function tick(){
  const message=messages[index].text;
  if(!removing){
   chars=Math.min(chars+1,message.length);render();
   if(chars===message.length){removing=true;setTimeout(tick,index===0?2800:1100);return;}
   setTimeout(tick,65);
  }else{
   chars=Math.max(chars-1,0);render();
   if(chars===0){removing=false;index=(index+1)%messages.length;setTimeout(tick,450);return;}
   setTimeout(tick,32);
  }
 }
 render();
 const section=heading.closest('.showcase');
 if(!('IntersectionObserver' in window)){setTimeout(tick,450);return;}
 const startObserver=new IntersectionObserver(entries=>{
  if(entries.some(entry=>entry.isIntersecting)){
   startObserver.disconnect();setTimeout(tick,450);
  }
 },{threshold:.12});
 startObserver.observe(section);
})();


// Linha do tempo: títulos se deslocam até o centro; fundo desfoca ao abrir.
(()=>{
 const section=document.querySelector('.partner-timeline');if(!section)return;
 const show=()=>section.classList.add('is-visible');
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){show();observer.disconnect()}},{threshold:.3});observer.observe(section)}else show();
 const inner=section.querySelector('.timeline-inner');
 const detail=section.querySelector('.timeline-detail');
 const title=detail.querySelector('.timeline-detail-title');
 const description=detail.querySelector('.timeline-detail-description');
 const triggers=[...section.querySelectorAll('.timeline-trigger')];
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let flying=null,active=null,busy=false;
 function moveTitle(from,to,text,done){
  if(flying){flying.remove();flying=null}
  // O elemento em movimento usa exatamente a tipografia do destino.
  // O FLIP interpola apenas posição e escala, sem trocar de fonte no fim.
  const base=inner.getBoundingClientRect();
  const a=from.getBoundingClientRect(),b=to.getBoundingClientRect();
  const style=getComputedStyle(to);
  const el=document.createElement('span');flying=el;
  el.className='timeline-flying-title';el.textContent=text;
  Object.assign(el.style,{
   left:(b.left-base.left)+'px',top:(b.top-base.top)+'px',
   width:b.width+'px',height:b.height+'px',
   fontFamily:style.fontFamily,fontSize:style.fontSize,fontWeight:style.fontWeight,
   letterSpacing:style.letterSpacing,lineHeight:style.lineHeight,
   textAlign:'center',display:'flex',alignItems:'center',justifyContent:'center',
   transformOrigin:'center center',margin:'0',padding:'0'
  });
  inner.appendChild(el);
  const acx=a.left+a.width/2,acy=a.top+a.height/2;
  const bcx=b.left+b.width/2,bcy=b.top+b.height/2;
  const start=`translate(${acx-bcx}px,${acy-bcy}px) scale(${a.width/Math.max(b.width,1)},${a.height/Math.max(b.height,1)})`;
  const anim=el.animate([{transform:start},{transform:'translate(0px,0px) scale(1)'}],
   {duration:reduced?1:800,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'});
  anim.onfinish=()=>{
   // Mostrar o título real antes de retirar a cópia evita um frame vazio.
   to.style.opacity='1';
   el.remove();if(flying===el)flying=null;
   done();
  };
 }
 function open(button){
  if(busy||active)return;busy=true;active=button;
  title.textContent=button.dataset.title;description.textContent=button.dataset.description;
  detail.hidden=false;
  title.style.visibility='visible';title.style.opacity='0';
  button.setAttribute('aria-expanded','true');
  const source=button.querySelector('.timeline-name');
  const wasHover=source.getBoundingClientRect();
  section.classList.add('detail-open');
  // Esconde a origem apenas após capturar sua geometria.
  source.style.opacity='0';
  moveTitleFromRect(wasHover,title,button.dataset.title,()=>{
   section.classList.add('detail-text-visible');busy=false;
  });
 }
 function moveTitleFromRect(rect,to,text,done){
  // Retângulo estável mesmo depois do fade/desfoque do restante da linha.
  const placeholder=document.createElement('span');
  Object.assign(placeholder.style,{position:'fixed',left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px',pointerEvents:'none',visibility:'hidden'});
  document.body.appendChild(placeholder);
  moveTitle(placeholder,to,text,()=>{placeholder.remove();done()});
 }
 function close(){
  if(busy||!active)return;busy=true;
  section.classList.remove('detail-text-visible');
  const source=active.querySelector('.timeline-name');
  const destination=source.getBoundingClientRect();
  const origin=title.getBoundingClientRect();
  title.style.opacity='0';
  // A linha reaparece em paralelo; o nome só reaparece após a chegada.
  section.classList.remove('detail-open');
  moveTitleFromRect(origin,source,active.dataset.title,()=>{
   active.setAttribute('aria-expanded','false');active=null;
   detail.hidden=true;title.style.opacity='0';busy=false;
  });
 }
 triggers.forEach(button=>button.addEventListener('click',()=>active===button?close():open(button)));
 detail.querySelector('.timeline-close').addEventListener('click',close);
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&active)close()});
})();
