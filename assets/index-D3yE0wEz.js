(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))e(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&e(o)}).observe(document,{childList:!0,subtree:!0});function n(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function e(a){if(a.ep)return;a.ep=!0;const i=n(a);fetch(a.href,i)}})();const g={title:"Europe Autumn Grand Tour",subtitle:"3D Virtual Road Trip Across Europe",myMapsOpen:"https://www.google.com/maps/d/edit?mid=1msDendyXwmU4o2SLgb1RbBBB7nJCBa4"},$="/travel-guide/",T=[["03 DRIVE 1","Amsterdam","Lillehammer"],["04 DRIVE 2","Lillehammer","Warsaw"],["05 DRIVE 3","Warsaw","Grindelwald"],["06 DRIVE 4","Grindelwald","Porto"],["07 DRIVE 5","Porto","Port of Barcelona"],["08 DRIVE 6","Civitavecchia","Shkodër"],["09 DRIVE 7","Shkodër","Belgrade"],["10 DRIVE 8","Belgrade","Amsterdam Schiphol"]],P=document.querySelector("#app");let p=[],_=[],d=0,y="All",u="cn",m=0,b=!0,R=window.matchMedia("(prefers-reduced-motion: reduce)").matches;function L(t){const r=[];let n=[],e="",a=!1;for(let o=0;o<t.length;o+=1){const c=t[o],s=t[o+1];c==='"'&&a&&s==='"'?(e+='"',o+=1):c==='"'?a=!a:c===","&&!a?(n.push(e),e=""):(c===`
`||c==="\r")&&!a?(c==="\r"&&s===`
`&&(o+=1),n.push(e),n.some(f=>f.trim())&&r.push(n),n=[],e=""):e+=c}(e||n.length)&&(n.push(e),r.push(n));const i=r.shift()??[];return r.map(o=>Object.fromEntries(i.map((c,s)=>[c,o[s]??""])))}function k(t){return`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t)}`}function M(t){return`https://earth.google.com/web/search/${encodeURIComponent(t)}`}function A(t){return`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${encodeURIComponent(t)}`}function N(t,r){return`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${t},${r}`}function E(t,r){try{const n=new URL(t);return n.protocol==="https:"||n.protocol==="http:"?n.toString():r}catch{return r}}function l(t){return String(t??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function x(t,r){const n=new Map;return r.forEach(e=>{const a=e.properties.name.replace(/^Leg \d+:\s*/,"").split(",")[0].trim();n.set(a.toLowerCase(),e.geometry.coordinates)}),t.map((e,a)=>{const i=n.get(e.Map_Name.toLowerCase())??O(e.Map_Name,a);return{...e,lng:i[0],lat:i[1]}})}function O(t,r){const n={Giethoorn:[6.083,52.74],Lübeck:[10.687,53.866],Flåm:[7.114,60.861],Geiranger:[7.207,62.101],Lillehammer:[10.466,61.115],Karlstad:[13.511,59.402],Jönköping:[14.161,57.782],Helsingborg:[12.694,56.046],Odense:[10.388,55.403],Schwerin:[11.413,53.635],Poznań:[16.925,52.406],Olomouc:[17.251,49.594],"Český Krumlov":[14.315,48.812],Hallstatt:[13.649,47.562],Salzburg:[13.055,47.81],Ortisei:[11.674,46.576],"St. Moritz":[9.839,46.498],Grindelwald:[8.041,46.624],"Chamonix-Mont-Blanc":[6.869,45.923],Annecy:[6.129,45.899],Avignon:[4.805,43.949],Collioure:[3.083,42.526],Zaragoza:[-.889,41.648],Salamanca:[-5.664,40.97],Évora:[-7.913,38.571],Granada:[-3.599,37.178],Alicante:[-.481,38.345],Valencia:[-.376,39.469],"Port of Barcelona":[2.173,41.353],"Port of Civitavecchia":[11.795,42.094],Venice:[12.315,45.44],Ljubljana:[14.505,46.056],"Plitvice Lakes National Park":[15.582,44.865],Split:[16.44,43.508],Dubrovnik:[18.094,42.651],Kotor:[18.771,42.424],Shkodër:[19.512,42.069],Gjirokastër:[20.138,40.075],Ioannina:[20.851,39.665],Patras:[21.735,38.246],Athens:[23.728,37.984],Delphi:[22.501,38.482],Meteora:[21.63,39.721],Skopje:[21.431,41.998],Niš:[21.896,43.321],Belgrade:[20.457,44.817],"Novi Sad":[19.833,45.267],Linz:[14.286,48.306],Regensburg:[12.102,49.013],Würzburg:[9.953,49.792],Bacharach:[7.769,50.057],Cologne:[6.96,50.938],"Amsterdam Airport Schiphol":[4.763,52.31]};return n[t]?n[t]:[4+r*.22,52-r*.04]}function V(t,r,n,e){const s=(t- -10)/36*n,f=e-(r-36)/28*e;return{x:s,y:f}}function S(){const t=document.querySelector("#route-canvas");if(!t||!p.length)return;const r=t.getBoundingClientRect(),n=Math.min(window.devicePixelRatio||1,2);t.width=Math.floor(r.width*n),t.height=Math.floor(r.height*n);const e=t.getContext("2d");e.scale(n,n),e.clearRect(0,0,r.width,r.height);const a=e.createLinearGradient(0,0,r.width,r.height);a.addColorStop(0,"#17324d"),a.addColorStop(.55,"#23556a"),a.addColorStop(1,"#6a8d6d"),e.fillStyle=a,e.fillRect(0,0,r.width,r.height),e.save(),e.globalAlpha=.2,e.strokeStyle="#d7e7db";for(let s=0;s<18;s+=1)e.beginPath(),e.moveTo(0,s*38+10),e.lineTo(r.width,s*28-40),e.stroke();for(let s=0;s<20;s+=1)e.beginPath(),e.moveTo(s*58-100,0),e.lineTo(s*42+40,r.height),e.stroke();e.restore();const i=p.map(s=>V(s.lng,s.lat,r.width,r.height));e.lineCap="round",e.lineJoin="round",e.strokeStyle="rgba(8, 22, 38, .55)",e.lineWidth=10,v(e,i),e.strokeStyle="#ffffff",e.lineWidth=5,v(e,i),e.strokeStyle="#2d8cff",e.lineWidth=3,v(e,i);const o=Math.max(1,Math.floor(m*(i.length-1)));e.strokeStyle="#ffcf5a",e.lineWidth=6,v(e,i.slice(0,o+1)),i.forEach((s,f)=>{const w=f===d;e.beginPath(),e.fillStyle=w?"#ff7a1a":"#1fb67a",e.strokeStyle="#fff",e.lineWidth=w?4:2,e.arc(s.x,s.y,w?8:5,0,Math.PI*2),e.fill(),e.stroke()});const c=i[d];c&&(e.beginPath(),e.strokeStyle="#ffcf5a",e.lineWidth=2,e.arc(c.x,c.y,18+Math.sin(Date.now()/260)*4,0,Math.PI*2),e.stroke())}function v(t,r){r.length&&(t.beginPath(),t.moveTo(r[0].x,r[0].y),r.slice(1).forEach(n=>t.lineTo(n.x,n.y)),t.stroke())}function U(){const t=p[d],r=_.filter(n=>Number(n.Stop_Order)===Number(t.Order));return y==="All"?r:r.filter(n=>n.Priority===y)}function D(){const t=p[d],r=u==="cn"?`${t.Map_Name}。${t.Why_This_Stop} 秋季窗口：${t.Autumn_Target_Window}。`:`${t.Map_Name}. ${t.Country}. Autumn window: ${t.Autumn_Target_Window}. ${t.Route_Theme}.`;window.speechSynthesis.cancel();const n=new SpeechSynthesisUtterance(r);n.lang=u==="cn"?"zh-CN":"en-US",window.speechSynthesis.speak(n)}function h(){const t=p[d],r=U(),n=["All",...Array.from(new Set(_.map(o=>o.Priority))).filter(Boolean)],e=k(t.Location),a=M(t.Location),i=typeof t.lat=="number"&&typeof t.lng=="number"?N(t.lat,t.lng):A(t.Location);P.innerHTML=`
    <main>
      <section class="hero">
        <div class="hero__copy">
          <p class="eyebrow">PUBLIC TRAVEL GUIDE PLATFORM</p>
          <h1>${l(g.title)}</h1>
          <p>${l(g.subtitle)}</p>
          <div class="hero__actions">
            <a class="button primary" href="${g.myMapsOpen}" target="_blank" rel="noreferrer">Open My Maps</a>
            <a class="button" href="${a}" target="_blank" rel="noreferrer">Google Earth 3D</a>
          </div>
        </div>
        <canvas id="route-canvas" aria-label="3D route fly-through canvas"></canvas>
      </section>

      <section class="toolbar" aria-label="Trip controls">
        <button id="prev-stop" class="icon-btn" title="Previous stop">‹</button>
        <input id="route-progress" type="range" min="0" max="${p.length-1}" value="${d}" />
        <button id="next-stop" class="icon-btn" title="Next stop">›</button>
        <button id="play" class="button">${b?"Pause flight":"Play flight"}</button>
        <button id="lang" class="button">${u==="cn"?"中文":"English"}</button>
        <button id="narrate" class="button">Narration</button>
      </section>

      <section class="layout">
        <aside class="stops" aria-label="Route stops">
          ${T.map(([o,c,s])=>`<div class="drive-chip"><strong>${l(o)}</strong><span>${l(c)} → ${l(s)}</span></div>`).join("")}
          <div class="stop-list">
            ${p.map((o,c)=>`
                  <button class="stop-row ${c===d?"active":""}" data-stop="${c}">
                    <span>${l(o.Order.padStart(2,"0"))}</span>
                    <strong>${l(o.Map_Name)}</strong>
                    <small>${l(o.Country)} · ${l(o.Autumn_Priority)}</small>
                  </button>
                `).join("")}
          </div>
        </aside>

        <section class="guide">
          <div class="guide__header">
            <div>
              <p class="eyebrow">STOP ${l(t.Order)} · ${l(t.Country)}</p>
              <h2>${l(t.Map_Name)}</h2>
            </div>
            <div class="guide__links">
              <a href="${e}" target="_blank" rel="noreferrer">Maps</a>
              <a href="${a}" target="_blank" rel="noreferrer">Earth</a>
              <a href="${i}" target="_blank" rel="noreferrer">Street View</a>
            </div>
          </div>
          <div class="facts">
            <span>${l(t.Recommended_Nights||"0")} nights</span>
            <span>${l(t.Drive_Class)}</span>
            <span>${l(t.Approx_Miles_From_Previous)} mi from previous</span>
            <span>${l(t.Autumn_Target_Window)}</span>
          </div>
          <p class="lead">${l(u==="cn"?t.Why_This_Stop:`${t.Route_Theme}. This stop anchors the route in ${t.Country} and sets up the next drive segment.`)}</p>

          <div class="map-embed">
            <div>
              <p class="eyebrow">EXTERNAL MAPS</p>
              <h3>Continue in Google</h3>
              <p>
                The public guide keeps the route and attraction data available here, with direct handoff
                links for Google's map, Earth, and Street View experiences.
              </p>
              <div class="hero__actions">
                <a class="button primary" href="${g.myMapsOpen}" target="_blank" rel="noreferrer">Open My Maps</a>
                <a class="button" href="${e}" target="_blank" rel="noreferrer">Open Maps</a>
                <a class="button" href="${a}" target="_blank" rel="noreferrer">Open Earth</a>
                <a class="button" href="${i}" target="_blank" rel="noreferrer">Street View</a>
              </div>
            </div>
          </div>

          <div class="attraction-tools">
            <h3>${u==="cn"?"景点导游":"Attraction Guide"}</h3>
            <select id="priority-filter" aria-label="Filter attractions by priority">
              ${n.map(o=>`<option value="${l(o)}" ${o===y?"selected":""}>${l(o)}</option>`).join("")}
            </select>
          </div>

          <div class="attractions">
            ${r.length?r.map(o=>{const c=E(o.Google_Maps_Search_URL,k(o.Location)),s=o.Source_URL?E(o.Source_URL,""):"";return`
                        <article class="attraction-card">
                          <div>
                            <span class="priority">${l(o.Priority)}</span>
                            <h4>${l(o.Map_Name)}</h4>
                            <p>${l(u==="cn"?o.Story_Theme_CN:o.Location)}</p>
                          </div>
                          <dl>
                            <dt>${u==="cn"?"怎么玩":"How"}</dt>
                            <dd>${l(u==="cn"?o.How_To_Experience_CN:o.Recommended_Time)}</dd>
                            <dt>${u==="cn"?"看什么":"Look For"}</dt>
                            <dd>${l(u==="cn"?o.What_To_Look_For_CN:o.Best_Time)}</dd>
                            <dt>${u==="cn"?"秋季重点":"Autumn"}</dt>
                            <dd>${l(u==="cn"?o.Autumn_Focus_CN:o.Practical_Tip_CN)}</dd>
                          </dl>
                          <div class="card-links">
                            <a href="${c}" target="_blank" rel="noreferrer">Maps</a>
                            <a href="${M(o.Location)}" target="_blank" rel="noreferrer">Earth</a>
                            <a href="${A(o.Location)}" target="_blank" rel="noreferrer">Street View</a>
                            ${s?`<a href="${s}" target="_blank" rel="noreferrer">Source</a>`:""}
                          </div>
                        </article>
                      `}).join(""):'<p class="empty">No attractions are listed for this stop yet.</p>'}
          </div>
        </section>
      </section>
    </main>
  `,I(),S()}function I(){document.querySelectorAll("[data-stop]").forEach(t=>{t.addEventListener("click",()=>{d=Number(t.dataset.stop),m=d/Math.max(1,p.length-1),h()})}),document.querySelector("#prev-stop")?.addEventListener("click",()=>{d=Math.max(0,d-1),m=d/Math.max(1,p.length-1),h()}),document.querySelector("#next-stop")?.addEventListener("click",()=>{d=Math.min(p.length-1,d+1),m=d/Math.max(1,p.length-1),h()}),document.querySelector("#play")?.addEventListener("click",()=>{b=!b,h()}),document.querySelector("#lang")?.addEventListener("click",()=>{u=u==="cn"?"en":"cn",h()}),document.querySelector("#narrate")?.addEventListener("click",D),document.querySelector("#priority-filter")?.addEventListener("change",t=>{y=t.target.value,h()}),document.querySelector("#route-progress")?.addEventListener("input",t=>{d=Number(t.target.value),m=d/Math.max(1,p.length-1),h()})}async function q(){const[t,r,n]=await Promise.all([fetch(`${$}data/route-stops.csv`).then(e=>e.text()),fetch(`${$}data/attractions.csv`).then(e=>e.text()),fetch(`${$}data/route-points.geojson`).then(e=>e.json())]);p=x(L(t),n.features),_=L(r),h(),requestAnimationFrame(C)}function C(){b&&!R&&p.length&&(m=(m+8e-4)%1,d=Math.round(m*(p.length-1)),S()),requestAnimationFrame(C)}window.addEventListener("resize",S);q().catch(t=>{P.innerHTML=`<main class="error"><h1>Travel guide failed to load</h1><pre>${l(String(t))}</pre></main>`});
