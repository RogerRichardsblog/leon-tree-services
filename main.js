(function(){
  var d=document, reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  requestAnimationFrame(function(){ d.body.classList.add('loaded'); });
  var NS='http://www.w3.org/2000/svg', PHONE='+12094224716';

  /* thumb bar after hero CTA leaves view */
  var thumb=d.querySelector('.thumb'), heroCta=d.querySelector('.hero .cta-row');
  if('IntersectionObserver' in window && thumb && heroCta){
    new IntersectionObserver(function(e){ thumb.classList.toggle('show',!e[0].isIntersecting && e[0].boundingClientRect.top<0); }).observe(heroCta);
  } else if(thumb){ thumb.classList.add('show'); }

  /* desktop: text links can't send, route to the form */
  var desk=window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* size up: tree vs house */
  var inp=d.getElementById('h-in'), out=d.getElementById('h-out'), svg=d.querySelector('.scale-svg');
  var G=270, house=svg.querySelector('.house path'), door=svg.querySelector('.house .door'), lbl=svg.querySelector('.house .lbl');
  var trunk=svg.querySelector('.trunk'), crown=svg.querySelector('.crown'), read=svg.querySelector('.h-read'), ticks=svg.querySelector('.ticks');
  function draw(h){
    var u=Math.min(5.7,222/h), H=h*u;
    var x0=62, w=22*u, wall=10*u, peak=15*u;
    house.setAttribute('d','M'+x0+' '+G+' V'+(G-wall)+' L'+(x0+w/2)+' '+(G-peak)+' L'+(x0+w)+' '+(G-wall)+' V'+G+' Z');
    door.setAttribute('x',x0+w/2-3.2*u); door.setAttribute('y',G-6.8*u); door.setAttribute('width',6.4*u); door.setAttribute('height',6.8*u);
    lbl.setAttribute('x',x0+w/2);
    var tw=Math.max(7,.07*H), cx=262;
    trunk.setAttribute('x',cx-tw/2); trunk.setAttribute('width',tw); trunk.setAttribute('y',G-.45*H); trunk.setAttribute('height',.45*H);
    var ry=.36*H, rx=Math.min(84,.24*H+12);
    crown.setAttribute('cx',cx); crown.setAttribute('cy',G-H+ry); crown.setAttribute('rx',rx); crown.setAttribute('ry',ry);
    read.setAttribute('x',cx); read.setAttribute('y',Math.max(22,G-H-10)); read.textContent=h+' ft';
    while(ticks.firstChild) ticks.removeChild(ticks.firstChild);
    var step=h>40?20:10;
    for(var f=step; f<=h+0.1; f+=step){
      var y=G-f*u, l=d.createElementNS(NS,'line'); l.setAttribute('x1',34); l.setAttribute('x2',352); l.setAttribute('y1',y); l.setAttribute('y2',y); ticks.appendChild(l);
      var t=d.createElementNS(NS,'text'); t.setAttribute('x',4); t.setAttribute('y',y+3); t.textContent=f+' ft'; ticks.appendChild(t);
    }
    out.textContent=h+' ft';
    inp.style.setProperty('--fill',((h-10)/70*100)+'%');
  }
  var jobs={trim:'a tree trimmed or pruned',remove:'a tree removed',stump:'a stump and debris cleared',fence:'a wood fence put in'};
  var sum=d.getElementById('sum-text'), sms=d.getElementById('sum-sms');
  function smsHref(body){ return 'sms:'+PHONE+'?body='+encodeURIComponent(body); }
  function update(){
    var h=+inp.value; draw(h);
    var job=(d.querySelector('input[name=job]:checked')||{}).value||'trim';
    var near=[].map.call(d.querySelectorAll('input[name=near]:checked'),function(i){return i.value;});
    var s='Hi Leon, I need '+jobs[job]+'.';
    if(job!=='fence') s+=" It's about "+h+' ft tall.';
    if(near.length) s+=' It\'s close to '+(near.length>1? near.slice(0,-1).join(', ')+' and '+near[near.length-1] : near[0])+'.';
    s+=' Photos attached.';
    sum.textContent=s;
    if(!desk) sms.href=smsHref(s);
    svg.classList.toggle('is-fence',job==='fence');
  }
  inp.addEventListener('input',update);
  [].forEach.call(d.querySelectorAll('.chips input'),function(i){ i.addEventListener('change',update); });
  update();

  if(desk){
    [].forEach.call(d.querySelectorAll('.js-sms'),function(a){ a.href='#quote'; var sp=a.querySelector('span'); if(sp) sp.textContent='Send photos'; });
    sms.href='#quote'; sms.querySelector('span').textContent='Send it with the quote form';
    sms.addEventListener('click',function(){ var ta=d.querySelector('#qform textarea'); if(ta && !ta.value) ta.value=sum.textContent; });
  }

  /* services reveal: observe the list, not hidden children */
  var svc=d.querySelector('.svc');
  if(svc){
    [].forEach.call(svc.children,function(li,i){ li.style.transitionDelay=(i*90)+'ms'; });
    if('IntersectionObserver' in window && !reduce){
      var io=new IntersectionObserver(function(e){ if(e[0].isIntersecting){ svc.classList.add('in'); io.disconnect(); } },{threshold:.15});
      io.observe(svc);
    } else svc.classList.add('in');
  }

  /* rail progress */
  var rail=d.querySelector('.rail'), cnt=d.querySelector('.rail-count b'), bar=d.querySelector('.rail-bar i');
  if(rail && cnt){
    var n=rail.querySelectorAll('.card').length;
    rail.addEventListener('scroll',function(){
      var max=rail.scrollWidth-rail.clientWidth, p=max>0?rail.scrollLeft/max:0, i=Math.min(n,Math.round(p*(n-1))+1);
      cnt.textContent=(i<10?'0':'')+i; bar.style.width=(16+p*84)+'%';
    },{passive:true});
  }

  /* mockup form: validate, never send */
  var f=d.getElementById('qform'), fo=d.getElementById('form-out');
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var bad=[];
    ['name','phone'].forEach(function(k){ var el=f.elements[k], ok=el.value.trim().length>(k==='phone'?6:0); el.setAttribute('aria-invalid',!ok); if(!ok) bad.push(el); });
    if(bad.length){ fo.className='form-out err'; fo.textContent='Please add your '+(bad.length>1?'name and phone':bad[0].name)+' so Leon can call you back.'; bad[0].focus(); return; }
    fo.className='form-out ok';
    fo.textContent='Mockup only: nothing was sent. Once this is set up, Leon would get your request and photos here. For now, call or text (209) 422-4716.';
  });
})();
