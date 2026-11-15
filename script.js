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
 pause?.addEventListener('click',()=>{playing=!playing;pause.querySelector('img').src=playing?'pause.svg':'play.svg';pause.setAttribute('aria-label',playing?'Pausar animação':'Retomar animação')});
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


// Linha do tempo: um único título, sem reiniciar o reveal no retorno.
(()=>{
 const section=document.querySelector('.partner-timeline');if(!section)return;
 const inner=section.querySelector('.timeline-inner');
 const detail=section.querySelector('.timeline-detail');
 const title=detail.querySelector('.timeline-detail-title');
 const description=detail.querySelector('.timeline-detail-description');
 const triggers=[...section.querySelectorAll('.timeline-trigger')];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let active=null, flying=null, anchor=null, busy=false;
 const finalizeIntro=()=>section.classList.add('timeline-initial-complete');
 const reveal=()=>{
  section.classList.add('is-visible');
  // Só a primeira visita executa o reveal. Antes de qualquer interação,
  // consolidar os estados finais para evitar saltos em dots e labels.
  setTimeout(finalizeIntro,reduced?0:2700);
 };
 if('IntersectionObserver' in window){
  const obs=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){reveal();obs.disconnect()}},{threshold:.3});obs.observe(section);
 }else reveal();
 const box=()=>inner.getBoundingClientRect();
 function coords(rect){const b=box();return {left:rect.left-b.left,top:rect.top-b.top,width:rect.width,height:rect.height};}
 function position(el,rect,fontSize){
  const r=coords(rect);
  Object.assign(el.style,{position:'absolute',left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px',fontSize:fontSize+'px',margin:'0',padding:'0',display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',whiteSpace:'nowrap',zIndex:'12',opacity:'1',transform:'none',scale:'1',animation:'none',transition:'none',filter:'none',pointerEvents:'none'});
 }
 function animateTo(el,targetRect,targetSize,done){
  const start=el.getBoundingClientRect(),a=coords(start),b=coords(targetRect);
  const startSize=parseFloat(getComputedStyle(el).fontSize);
  const anim=el.animate([
   {left:a.left+'px',top:a.top+'px',width:a.width+'px',height:a.height+'px',fontSize:startSize+'px'},
   {left:b.left+'px',top:b.top+'px',width:b.width+'px',height:b.height+'px',fontSize:targetSize+'px'}
  ],{duration:reduced?1:850,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'});
  anim.onfinish=()=>{
   // Aplicar posição final antes de cancelar a animação, evitando 1 frame de salto.
   position(el,targetRect,targetSize);
   anim.cancel();done();
  };
 }
 function open(button){
  if(busy||active)return;
  busy=true;active=button;finalizeIntro();
  const el=button.querySelector('.timeline-name');
  const sourceRect=el.getBoundingClientRect();
  const fontSize=parseFloat(getComputedStyle(el).fontSize);
  title.textContent=button.dataset.title;
  description.textContent=button.dataset.description;
  detail.hidden=false;
  anchor=document.createElement('span');anchor.className='timeline-name-placeholder';
  anchor.style.cssText=`display:block;width:${sourceRect.width}px;height:${sourceRect.height}px;visibility:hidden;flex-shrink:0`;
  el.before(anchor);
  flying=el;inner.appendChild(el);
  position(el,sourceRect,fontSize);el.dataset.homeSize=fontSize;
  button.setAttribute('aria-expanded','true');
  const target=title.getBoundingClientRect();
  section.classList.add('detail-open');
  animateTo(el,target,parseFloat(getComputedStyle(title).fontSize),()=>{
   section.classList.add('detail-text-visible');busy=false;
  });
 }
 function close(){
  if(busy||!active)return;
  busy=true;
  section.classList.remove('detail-text-visible');
  // Não reexibir linha e pontos até o título voltar completamente.
  const target=anchor.getBoundingClientRect();
  animateTo(flying,target,Number(flying.dataset.homeSize),()=>{
   const el=flying;
   // Mantém o nome invisível no fluxo apenas durante a troca de DOM.
   el.style.visibility='hidden';
   anchor.replaceWith(el);
   el.removeAttribute('style');delete el.dataset.homeSize;
   anchor=null;flying=null;
   active.setAttribute('aria-expanded','false');active=null;
   detail.hidden=true;
   // Um único frame de layout estável, depois fade/blur de volta.
   requestAnimationFrame(()=>{
    section.classList.remove('detail-open');
    busy=false;
   });
  });
 }
 triggers.forEach(button=>button.addEventListener('click',()=>active===button?close():open(button)));
 detail.querySelector('.timeline-close').addEventListener('click',close);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&active)close()});
})();

// Indicador autônomo: percorre a linha continuamente e segue o mouse quando próximo.
(()=>{
 const section=document.querySelector('.partner-timeline');
 if(!section||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
 const inner=section.querySelector('.timeline-inner');
 const line=section.querySelector('.timeline-line');
 const dots=[...section.querySelectorAll('.timeline-dot')];
 if(!inner||!line||!dots.length)return;
 const cursor=document.createElement('span');
 cursor.className='timeline-cursor-dot';cursor.setAttribute('aria-hidden','true');
 inner.appendChild(cursor);
 let x=null, direction=1, lastTime=0, pointerX=0, lastPointerTime=-Infinity;
 let lastHit=-1;
 const speed=105; // pixels por segundo, movimento constante entre as pontas
 function pop(dot){
  dot.classList.remove('cursor-pop');void dot.offsetWidth;dot.classList.add('cursor-pop');
  dot.addEventListener('animationend',()=>dot.classList.remove('cursor-pop'),{once:true});
 }
 document.addEventListener('pointermove',e=>{
  if(e.pointerType==='touch')return;
  pointerX=e.clientX;lastPointerTime=performance.now();
 },{passive:true});

 function tick(time){
  requestAnimationFrame(tick);
  const dt=Math.min((time-lastTime)/1000||0,.05);lastTime=time;
  if(!section.classList.contains('timeline-initial-complete')||section.classList.contains('detail-open')){
   cursor.classList.remove('is-tracking');lastHit=-1;return;
  }
  const track=line.getBoundingClientRect(),parent=inner.getBoundingClientRect();
  if(!track.width)return;
  const min=track.left,max=track.right,cy=track.top+track.height/2;
  if(x===null)x=min;
  x=Math.max(min,Math.min(max,x));
  // Qualquer movimento do mouse assume o controle, independentemente da distância vertical.
  // Após um intervalo sem movimento, o percurso automático recomeça.
  const mouseControlling=time-lastPointerTime<1600;
  if(mouseControlling){
   const target=Math.max(min,Math.min(max,pointerX));
   const alpha=1-Math.exp(-dt*16);
   const delta=target-x;
   x+=delta*alpha;
   if(Math.abs(delta)>0.5)direction=delta>0?1:-1;
  }else{
   x+=direction*speed*dt;
   if(x>=max){x=max-(x-max);direction=-1}
   if(x<=min){x=min+(min-x);direction=1}
  }
  cursor.style.left=(x-parent.left)+'px';
  cursor.style.top=(cy-parent.top)+'px';
  cursor.classList.add('is-tracking');
  const hit=dots.findIndex(dot=>{
   const r=dot.getBoundingClientRect();
   return Math.abs(x-(r.left+r.width/2))<=Math.max(9,r.width*.55);
  });
  if(hit!==lastHit){if(hit>=0)pop(dots[hit]);lastHit=hit}
 }
 requestAnimationFrame(tick);
})();

/* Mantém o centro do trilho exatamente alinhado ao centro das bolinhas. */
(()=>{
 const section=document.querySelector('.partner-timeline');
 if(!section)return;
 const inner=section.querySelector('.timeline-inner');
 const line=section.querySelector('.timeline-line');
 const dot=section.querySelector('.timeline-step .timeline-dot');
 if(!inner||!line||!dot)return;
 const align=()=>{
  const ir=inner.getBoundingClientRect();
  const dr=dot.getBoundingClientRect();
  const lh=line.getBoundingClientRect().height || 2;
  line.style.top=(dr.top+dr.height/2-ir.top-lh/2)+'px';
 };
 window.addEventListener('resize',align,{passive:true});
 window.addEventListener('load',align,{once:true});
 requestAnimationFrame(align);
})();

/* Anima os diferenciais uma única vez ao entrar na área visível. */
(()=>{const section=document.querySelector('.partner-differentials');if(!section)return;
const reveal=()=>section.classList.add('differentials-in-view');
if(!('IntersectionObserver' in window)){reveal();return;}
const target=section.querySelector('.differentials-grid')||section;
const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){reveal();observer.disconnect();}},{rootMargin:'-45% 0px -45% 0px',threshold:0});observer.observe(target);
})();

// Revela o vídeo da seção de contato apenas ao atingir o centro da viewport.
(()=>{
 const media=document.querySelector('.partner-contact .partner-contact-media');
 if(!media)return;
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)){media.classList.add('contact-video-visible');return;}
 const observer=new IntersectionObserver(entries=>{
  if(entries.some(entry=>entry.isIntersecting)){media.classList.add('contact-video-visible');observer.disconnect();}
 },{rootMargin:'-45% 0px -45% 0px',threshold:0});
 observer.observe(media);
})();

// Submenu Serviços: hover no desktop, clique e teclado, com fundo desfocado.
(()=>{
 const group=document.querySelector('.nav-services');const trigger=group?.querySelector('.nav-services-trigger');const backdrop=document.querySelector('.nav-backdrop');if(!group||!trigger)return;
 const setOpen=open=>{group.classList.toggle('is-open',open);document.body.classList.toggle('services-open',open);trigger.setAttribute('aria-expanded',String(open));};
 const desktop=()=>window.matchMedia('(min-width:851px)').matches;
 group.addEventListener('mouseenter',()=>{if(desktop())setOpen(true)});
 group.addEventListener('mouseleave',()=>{if(desktop())setOpen(false)});
 trigger.addEventListener('click',()=>setOpen(!group.classList.contains('is-open')));
 group.addEventListener('focusout',e=>{if(!group.contains(e.relatedTarget))setOpen(false)});
 backdrop?.addEventListener('click',()=>setOpen(false));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){setOpen(false);trigger.blur()}});
 document.addEventListener('pointerdown',e=>{if(!group.contains(e.target)&&!e.target.closest('.menu-toggle'))setOpen(false)});
 window.addEventListener('resize',()=>setOpen(false));
})();
