(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const themeButtons=[...document.querySelectorAll('[data-theme]')];
 const applyTheme=theme=>{document.documentElement.dataset.variant=theme;themeButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.theme===theme)));};
 applyTheme(document.documentElement.dataset.variant);
 themeButtons.forEach(b=>b.addEventListener('click',()=>{applyTheme(b.dataset.theme);const url=new URL(location.href);url.searchParams.set('variant',b.dataset.theme);history.replaceState(null,'',url);}));
 document.querySelectorAll('.media-rail').forEach(rail=>{
  const controls=[...document.querySelectorAll('[data-rail="'+rail.id+'"]')],status=document.querySelector('[data-status="'+rail.id+'"]');
  const update=()=>{const max=rail.scrollWidth-rail.clientWidth;controls.forEach(b=>b.disabled=Number(b.dataset.direction)<0?rail.scrollLeft<3:rail.scrollLeft>max-3);const width=rail.firstElementChild.getBoundingClientRect().width+parseFloat(getComputedStyle(rail).gap);status.textContent=String(Math.min(rail.children.length,Math.round(rail.scrollLeft/width)+1)).padStart(2,'0')+' / '+String(rail.children.length).padStart(2,'0')};
  const move=dir=>{const step=rail.firstElementChild.getBoundingClientRect().width+parseFloat(getComputedStyle(rail).gap);rail.scrollBy({left:dir*step,behavior:reduced?'instant':'smooth'})};
  controls.forEach(b=>b.addEventListener('click',()=>move(Number(b.dataset.direction))));rail.addEventListener('keydown',e=>{if(e.target!==rail)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1)}});rail.addEventListener('scroll',update,{passive:true});new ResizeObserver(update).observe(rail);update();
 });
 // Bind short Russian prepositions to their next word; do not alter controls or data.
 const walker=document.createTreeWalker(document.querySelector('main'),NodeFilter.SHOW_TEXT,{acceptNode(n){return n.parentElement.closest('p,h1,h2,h3,h4,li')&&!n.parentElement.closest('script,style,textarea,button')?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});let node;while(node=walker.nextNode())node.nodeValue=node.nodeValue.replace(/(^|[\s(«])([ВвКкСсУуОоИиАа]|[Нн]а|[Пп]о|[Дд]о|[Ии]з|[Оо]т|[Зз]а|[Нн]е) +(?=\S)/g,'$1$2\u00a0');
 if(!reduced&&'IntersectionObserver' in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('is-pending');io.unobserve(e.target)}}),{rootMargin:'0px 0px 50px 0px',threshold:.06});document.querySelectorAll('.company-intro .intro-grid,.company-credentials .credential-list,.service-detail,.phase,.timeline,.testi-card,.founder-layout').forEach(el=>{el.classList.add('reveal-on-scroll');if(el.getBoundingClientRect().top>innerHeight)el.classList.add('is-pending');io.observe(el)})}
})();
