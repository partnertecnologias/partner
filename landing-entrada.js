(()=>{
  const items=[...document.querySelectorAll('.service-hero-inner, .service-explain > div, .service-explain > p, .service-features > h2, .service-features .feature')];
  if(!items.length||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  // Elementos entram apenas quando cruzam a faixa central da tela.
  items.forEach(el=>el.classList.add('landing-reveal-ready'));
  const frame=document.querySelector('.landing-video-frame');
  if(frame){
    const revealVideo=()=>frame.classList.add('landing-revealed');
    if('IntersectionObserver' in window){
      const videoObserver=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){revealVideo();videoObserver.disconnect()}},{rootMargin:'-30% 0px -30% 0px',threshold:0});
      videoObserver.observe(frame);
    }else revealVideo();
  }
  if(!('IntersectionObserver' in window)){items.forEach(el=>el.classList.add('landing-revealed'));return}
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('landing-revealed');observer.unobserve(entry.target)}})},{rootMargin:'-42% 0px -42% 0px',threshold:0});
  items.forEach(el=>observer.observe(el));
})();
