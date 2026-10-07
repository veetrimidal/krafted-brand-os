/* Decorative cursor: native controls remain usable on touch and keyboard. */
(()=>{
 const fine=matchMedia('(hover: hover) and (pointer: fine)');
 const dot=document.createElement('div');dot.className='brand-cursor';dot.setAttribute('aria-hidden','true');document.body.append(dot);
 let enabled=false,x=0,y=0,frame=0;
 const hide=()=>{dot.classList.remove('visible','sidebar-glow')};
 const configure=()=>{enabled=fine.matches;document.documentElement.classList.toggle('brand-cursor-enabled',enabled);hide()};
 function move(event){
  if(!enabled||event.pointerType==='touch')return;
  x=event.clientX;y=event.clientY;
  const target=event.target instanceof Element?event.target:null;
  const interactive=target?.closest('a,button,[role="button"],[role="link"],summary,label,select,input[type="checkbox"],input[type="radio"],input[type="range"],input[type="color"]');
  dot.classList.toggle('interactive',!!interactive&&!interactive.matches(':disabled,[aria-disabled="true"]'));dot.classList.add('visible');
  if(!frame)frame=requestAnimationFrame(()=>{dot.style.transform=`translate3d(${x}px,${y}px,0)`;frame=0});
  dot.classList.toggle('sidebar-glow',!!target?.closest('.side'));
 }
 document.addEventListener('pointermove',move,{passive:true});
 document.addEventListener('pointerout',event=>{if(!event.relatedTarget)hide()},{passive:true});
 window.addEventListener('blur',hide);document.addEventListener('visibilitychange',()=>{if(document.hidden)hide()});
 fine.addEventListener('change',configure);configure();
})();
