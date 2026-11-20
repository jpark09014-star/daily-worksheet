const W=require('./src/gen.js');
let fails=0,total=0,bad=[];
for(const t of W.ORDER){W.CURRICULUM[t].forEach((u,i)=>{ if(!u.gen) return;
 for(let lv=1;lv<=3;lv++){ const r=W.makeR(1234+i*7+lv*101+t.charCodeAt(0));
  for(let k=0;k<800;k++){ total++; let p; try{p=W.G[u.gen](r,lv);}catch(e){fails++; bad.push(t+' '+u.name+' L'+lv+' ERR '+e.message); break;}
   const s=p.q+'|'+p.a+'|'+p.ex;
   if(!p.chk||/NaN|undefined|Infinity|null/.test(s)||p.a===''||/-\d/.test(p.a)&&!/^-/.test('')){ if(!p.chk||/NaN|undefined|Infinity|null/.test(s)||p.a===''){fails++; if(bad.length<40) bad.push(t+' '+u.name+' L'+lv+': '+s);} }
   if(/(을|이|은|과)\((를|가|는|와)\)/.test(s.replace(/<[^>]+>/g,''))) { /* unresolved josa, allowed only after non-hangul */ }
  }}
});}
console.log('total',total,'fails',fails); console.log(bad.slice(0,40).join('\n'));
// daily sheets
for(const t of W.ORDER){W.CURRICULUM[t].forEach((u,i)=>{ if(!u.gen) return; for(let lv=1;lv<=3;lv++){ const d=W.makeDaily({term:t,idx:i,level:lv,date:'2026-11-20'}); if(d.problems.length!==10) console.log('COUNT',t,u.name,lv,d.problems.length);} });}
// samples
const strip=s=>s.replace(/<span class="fr"><i>(\d+)<\/i><i>(\d+)<\/i><\/span>/g,'[$1/$2]').replace(/<span class="bx"><\/span>/g,'□').replace(/<[^>]+>/g,' ');
for(const t of W.ORDER){W.CURRICULUM[t].forEach((u,i)=>{ if(!u.gen) return; const r=W.makeR(99+i); for(const lv of [1,3]){ const p=W.G[u.gen](r,lv); console.log(t,u.name,'L'+lv,'|',strip(p.q),'=>',strip(p.a),'//',strip(p.ex)); }});}
