(()=>{
 const hero=document.querySelector('.smart-hero'),slides=[...hero.querySelectorAll('.hero-slide')],dots=[...hero.querySelectorAll('.slide-dots button')],pause=hero.querySelector('.slide-pause');
 let index=0,timer,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function show(i){index=(i+slides.length)%slides.length;slides.forEach((s,j)=>{s.hidden=j!==index;s.classList.toggle('is-active',j===index)});dots.forEach((b,j)=>b.setAttribute('aria-pressed',String(j===index)))}
 function stop(){clearInterval(timer)}
 function start(){stop();if(!paused&&!document.hidden)timer=setInterval(()=>show(index+1),6500)}
 function label(){pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-label',paused?'Включить смену слайдов':'Остановить смену слайдов')}
 hero.querySelector('.slide-prev').onclick=()=>{show(index-1);start()};hero.querySelector('.slide-next').onclick=()=>{show(index+1);start()};dots.forEach((b,i)=>b.onclick=()=>{show(i);start()});pause.onclick=()=>{paused=!paused;label();start()};hero.addEventListener('mouseenter',stop);hero.addEventListener('mouseleave',start);hero.addEventListener('focusin',stop);hero.addEventListener('focusout',start);document.addEventListener('visibilitychange',()=>document.hidden?stop():start());label();start();
 const dropdown=document.querySelector('.header-services');dropdown.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>dropdown.open=false));document.addEventListener('click',e=>{if(!dropdown.contains(e.target))dropdown.open=false});document.addEventListener('keydown',e=>{if(e.key==='Escape')dropdown.open=false});
})();
