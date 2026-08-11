(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))t(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&t(n)}).observe(document,{childList:!0,subtree:!0});function o(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function t(a){if(a.ep)return;a.ep=!0;const i=o(a);fetch(a.href,i)}})();const b={title:"Europe Autumn Grand Tour",subtitle:"3D Virtual Road Trip Across Europe",myMapsOpen:"https://www.google.com/maps/d/edit?mid=1msDendyXwmU4o2SLgb1RbBBB7nJCBa4"},$="/travel-guide/",R=[{name:"03 DRIVE 1",from:"Amsterdam",to:"Lillehammer",opensAt:"Amsterdam"},{name:"04 DRIVE 2",from:"Lillehammer",to:"Warsaw",opensAt:"Lillehammer"},{name:"05 DRIVE 3",from:"Warsaw",to:"Grindelwald",opensAt:"Warsaw"},{name:"06 DRIVE 4",from:"Grindelwald",to:"Porto",opensAt:"Grindelwald"},{name:"07 DRIVE 5",from:"Porto",to:"Port of Barcelona",opensAt:"Porto"},{name:"08 DRIVE 6",from:"Civitavecchia",to:"Shkodër",opensAt:"Rome"},{name:"09 DRIVE 7",from:"Shkodër",to:"Belgrade",opensAt:"Shkodër"},{name:"10 DRIVE 8",from:"Belgrade",to:"Amsterdam Schiphol",opensAt:"Belgrade"}],P=document.querySelector("#app");let d=[],S=[],p=0,_="All",u="cn",y=0,f=!0,x=window.matchMedia("(prefers-reduced-motion: reduce)").matches;function k(e){const r=[];let o=[],t="",a=!1;for(let n=0;n<e.length;n+=1){const c=e[n],s=e[n+1];c==='"'&&a&&s==='"'?(t+='"',n+=1):c==='"'?a=!a:c===","&&!a?(o.push(t),t=""):(c===`
`||c==="\r")&&!a?(c==="\r"&&s===`
`&&(n+=1),o.push(t),o.some(m=>m.trim())&&r.push(o),o=[],t=""):t+=c}(t||o.length)&&(o.push(t),r.push(o));const i=r.shift()??[];return r.map(n=>Object.fromEntries(i.map((c,s)=>[c,n[s]??""])))}function A(e){return`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e)}`}function M(e){return`https://earth.google.com/web/search/${encodeURIComponent(e)}`}function C(e){return`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${encodeURIComponent(e)}`}function O(e,r){return`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${e},${r}`}function E(e,r){try{const o=new URL(e);return o.protocol==="https:"||o.protocol==="http:"?o.toString():r}catch{return r}}function l(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function I(e,r){const o=new Map;return r.forEach(t=>{const a=t.properties.name.replace(/^Leg \d+:\s*/,"").split(",")[0].trim();o.set(a.toLowerCase(),t.geometry.coordinates)}),e.map((t,a)=>{const i=o.get(t.Map_Name.toLowerCase())??V(t.Map_Name,a);return{...t,lng:i[0],lat:i[1]}})}function V(e,r){const o={Giethoorn:[6.083,52.74],Lübeck:[10.687,53.866],Flåm:[7.114,60.861],Geiranger:[7.207,62.101],Lillehammer:[10.466,61.115],Karlstad:[13.511,59.402],Jönköping:[14.161,57.782],Helsingborg:[12.694,56.046],Odense:[10.388,55.403],Schwerin:[11.413,53.635],Poznań:[16.925,52.406],Olomouc:[17.251,49.594],"Český Krumlov":[14.315,48.812],Hallstatt:[13.649,47.562],Salzburg:[13.055,47.81],Ortisei:[11.674,46.576],"St. Moritz":[9.839,46.498],Grindelwald:[8.041,46.624],"Chamonix-Mont-Blanc":[6.869,45.923],Annecy:[6.129,45.899],Avignon:[4.805,43.949],Collioure:[3.083,42.526],Zaragoza:[-.889,41.648],Salamanca:[-5.664,40.97],Évora:[-7.913,38.571],Granada:[-3.599,37.178],Alicante:[-.481,38.345],Valencia:[-.376,39.469],"Port of Barcelona":[2.173,41.353],"Port of Civitavecchia":[11.795,42.094],Venice:[12.315,45.44],Ljubljana:[14.505,46.056],"Plitvice Lakes National Park":[15.582,44.865],Split:[16.44,43.508],Dubrovnik:[18.094,42.651],Kotor:[18.771,42.424],Shkodër:[19.512,42.069],Gjirokastër:[20.138,40.075],Ioannina:[20.851,39.665],Patras:[21.735,38.246],Athens:[23.728,37.984],Delphi:[22.501,38.482],Meteora:[21.63,39.721],Skopje:[21.431,41.998],Niš:[21.896,43.321],Belgrade:[20.457,44.817],"Novi Sad":[19.833,45.267],Linz:[14.286,48.306],Regensburg:[12.102,49.013],Würzburg:[9.953,49.792],Bacharach:[7.769,50.057],Cologne:[6.96,50.938],"Amsterdam Airport Schiphol":[4.763,52.31]};return o[e]?o[e]:[4+r*.22,52-r*.04]}function U(e,r,o,t){const s=(e- -10)/36*o,m=t-(r-36)/28*t;return{x:s,y:m}}function L(){const e=document.querySelector("#route-canvas");if(!e||!d.length)return;const r=e.getBoundingClientRect(),o=Math.min(window.devicePixelRatio||1,2);e.width=Math.floor(r.width*o),e.height=Math.floor(r.height*o);const t=e.getContext("2d");t.scale(o,o),t.clearRect(0,0,r.width,r.height);const a=t.createLinearGradient(0,0,r.width,r.height);a.addColorStop(0,"#17324d"),a.addColorStop(.55,"#23556a"),a.addColorStop(1,"#6a8d6d"),t.fillStyle=a,t.fillRect(0,0,r.width,r.height),t.save(),t.globalAlpha=.2,t.strokeStyle="#d7e7db";for(let s=0;s<18;s+=1)t.beginPath(),t.moveTo(0,s*38+10),t.lineTo(r.width,s*28-40),t.stroke();for(let s=0;s<20;s+=1)t.beginPath(),t.moveTo(s*58-100,0),t.lineTo(s*42+40,r.height),t.stroke();t.restore();const i=d.map(s=>U(s.lng,s.lat,r.width,r.height));t.lineCap="round",t.lineJoin="round",t.strokeStyle="rgba(8, 22, 38, .55)",t.lineWidth=10,w(t,i),t.strokeStyle="#ffffff",t.lineWidth=5,w(t,i),t.strokeStyle="#2d8cff",t.lineWidth=3,w(t,i);const n=Math.max(1,Math.floor(y*(i.length-1)));t.strokeStyle="#ffcf5a",t.lineWidth=6,w(t,i.slice(0,n+1)),i.forEach((s,m)=>{const g=m===p;t.beginPath(),t.fillStyle=g?"#ff7a1a":"#1fb67a",t.strokeStyle="#fff",t.lineWidth=g?4:2,t.arc(s.x,s.y,g?8:5,0,Math.PI*2),t.fill(),t.stroke()});const c=i[p];c&&(t.beginPath(),t.strokeStyle="#ffcf5a",t.lineWidth=2,t.arc(c.x,c.y,18+Math.sin(Date.now()/260)*4,0,Math.PI*2),t.stroke())}function w(e,r){r.length&&(e.beginPath(),e.moveTo(r[0].x,r[0].y),r.slice(1).forEach(o=>e.lineTo(o.x,o.y)),e.stroke())}function q(){const e=d[p],r=S.filter(o=>Number(o.Stop_Order)===Number(e.Order));return _==="All"?r:r.filter(o=>o.Priority===_)}function B(e){const r=e.toLowerCase(),o=d.findIndex(t=>t.Map_Name.toLowerCase()===r||t.Map_Name.toLowerCase().includes(r)||t.Location.toLowerCase().includes(r));return Math.max(0,o)}function D(e){const r=e.toLowerCase(),o=d.findIndex(t=>t.Map_Name.toLowerCase()===r||t.Map_Name.toLowerCase().includes(r)||t.Location.toLowerCase().includes(r));return o>=0?o:d.length-1}function v(e){p=Math.max(0,Math.min(d.length-1,e)),y=p/Math.max(1,d.length-1)}function G(){const e=d[p],r=u==="cn"?`${e.Map_Name}。${e.Why_This_Stop} 秋季窗口：${e.Autumn_Target_Window}。`:`${e.Map_Name}. ${e.Country}. Autumn window: ${e.Autumn_Target_Window}. ${e.Route_Theme}.`;window.speechSynthesis.cancel();const o=new SpeechSynthesisUtterance(r);o.lang=u==="cn"?"zh-CN":"en-US",window.speechSynthesis.speak(o)}function h(){const e=d[p],r=q(),o=["All",...Array.from(new Set(S.map(n=>n.Priority))).filter(Boolean)],t=A(e.Location),a=M(e.Location),i=typeof e.lat=="number"&&typeof e.lng=="number"?O(e.lat,e.lng):C(e.Location);P.innerHTML=`
    <main>
      <section class="hero">
        <div class="hero__copy">
          <p class="eyebrow">PUBLIC TRAVEL GUIDE PLATFORM</p>
          <h1>${l(b.title)}</h1>
          <p>${l(b.subtitle)}</p>
          <div class="hero__actions">
            <a class="button primary" href="${b.myMapsOpen}" target="_blank" rel="noreferrer">Open My Maps</a>
            <a class="button" href="${a}" target="_blank" rel="noreferrer">Google Earth 3D</a>
          </div>
        </div>
        <canvas id="route-canvas" aria-label="3D route fly-through canvas"></canvas>
      </section>

      <section class="toolbar" aria-label="Trip controls">
        <button id="prev-stop" class="icon-btn" title="Previous stop">‹</button>
        <input id="route-progress" type="range" min="0" max="${d.length-1}" value="${p}" />
        <button id="next-stop" class="icon-btn" title="Next stop">›</button>
        <button id="play" class="button">${f?"Pause flight":"Play flight"}</button>
        <button id="lang" class="button">${u==="cn"?"中文":"English"}</button>
        <button id="narrate" class="button">Narration</button>
      </section>

      <section class="layout">
        <aside class="stops" aria-label="Route stops">
          ${R.map(({name:n,from:c,to:s,opensAt:m})=>{const g=B(m),T=D(s);return`
                  <button class="drive-chip ${p>=g&&p<=T?"active":""}" data-drive="${g}">
                    <strong>${l(n)}</strong>
                    <span>${l(c)} → ${l(s)}</span>
                  </button>
                `}).join("")}
          <div class="stop-list">
            ${d.map((n,c)=>`
                  <button class="stop-row ${c===p?"active":""}" data-stop="${c}">
                    <span>${l(n.Order.padStart(2,"0"))}</span>
                    <strong>${l(n.Map_Name)}</strong>
                    <small>${l(n.Country)} · ${l(n.Autumn_Priority)}</small>
                  </button>
                `).join("")}
          </div>
        </aside>

        <section class="guide">
          <div class="guide__header">
            <div>
              <p class="eyebrow">STOP ${l(e.Order)} · ${l(e.Country)}</p>
              <h2>${l(e.Map_Name)}</h2>
            </div>
            <div class="guide__links">
              <a href="${t}" target="_blank" rel="noreferrer">Maps</a>
              <a href="${a}" target="_blank" rel="noreferrer">Earth</a>
              <a href="${i}" target="_blank" rel="noreferrer">Street View</a>
            </div>
          </div>
          <div class="facts">
            <span>${l(e.Recommended_Nights||"0")} nights</span>
            <span>${l(e.Drive_Class)}</span>
            <span>${l(e.Approx_Miles_From_Previous)} mi from previous</span>
            <span>${l(e.Autumn_Target_Window)}</span>
          </div>
          <p class="lead">${l(u==="cn"?e.Why_This_Stop:`${e.Route_Theme}. This stop anchors the route in ${e.Country} and sets up the next drive segment.`)}</p>

          <div class="map-embed">
            <div>
              <p class="eyebrow">EXTERNAL MAPS</p>
              <h3>Continue in Google</h3>
              <p>
                The public guide keeps the route and attraction data available here, with direct handoff
                links for Google's map, Earth, and Street View experiences.
              </p>
              <div class="hero__actions">
                <a class="button primary" href="${b.myMapsOpen}" target="_blank" rel="noreferrer">Open My Maps</a>
                <a class="button" href="${t}" target="_blank" rel="noreferrer">Open Maps</a>
                <a class="button" href="${a}" target="_blank" rel="noreferrer">Open Earth</a>
                <a class="button" href="${i}" target="_blank" rel="noreferrer">Street View</a>
              </div>
            </div>
          </div>

          <div class="attraction-tools">
            <h3>${u==="cn"?"景点导游":"Attraction Guide"}</h3>
            <select id="priority-filter" aria-label="Filter attractions by priority">
              ${o.map(n=>`<option value="${l(n)}" ${n===_?"selected":""}>${l(n)}</option>`).join("")}
            </select>
          </div>

          <div class="attractions">
            ${r.length?r.map(n=>{const c=E(n.Google_Maps_Search_URL,A(n.Location)),s=n.Source_URL?E(n.Source_URL,""):"";return`
                        <article class="attraction-card">
                          <div>
                            <span class="priority">${l(n.Priority)}</span>
                            <h4>${l(n.Map_Name)}</h4>
                            <p>${l(u==="cn"?n.Story_Theme_CN:n.Location)}</p>
                          </div>
                          <dl>
                            <dt>${u==="cn"?"怎么玩":"How"}</dt>
                            <dd>${l(u==="cn"?n.How_To_Experience_CN:n.Recommended_Time)}</dd>
                            <dt>${u==="cn"?"看什么":"Look For"}</dt>
                            <dd>${l(u==="cn"?n.What_To_Look_For_CN:n.Best_Time)}</dd>
                            <dt>${u==="cn"?"秋季重点":"Autumn"}</dt>
                            <dd>${l(u==="cn"?n.Autumn_Focus_CN:n.Practical_Tip_CN)}</dd>
                          </dl>
                          <div class="card-links">
                            <a href="${c}" target="_blank" rel="noreferrer">Maps</a>
                            <a href="${M(n.Location)}" target="_blank" rel="noreferrer">Earth</a>
                            <a href="${C(n.Location)}" target="_blank" rel="noreferrer">Street View</a>
                            ${s?`<a href="${s}" target="_blank" rel="noreferrer">Source</a>`:""}
                          </div>
                        </article>
                      `}).join(""):'<p class="empty">No attractions are listed for this stop yet.</p>'}
          </div>
        </section>
      </section>
    </main>
  `,W(),L()}function W(){document.querySelectorAll("[data-stop]").forEach(e=>{e.addEventListener("click",()=>{v(Number(e.dataset.stop)),f=!1,h()})}),document.querySelectorAll("[data-drive]").forEach(e=>{e.addEventListener("click",()=>{v(Number(e.dataset.drive)),f=!1,h()})}),document.querySelector("#prev-stop")?.addEventListener("click",()=>{v(p-1),h()}),document.querySelector("#next-stop")?.addEventListener("click",()=>{v(p+1),h()}),document.querySelector("#play")?.addEventListener("click",()=>{f=!f,h()}),document.querySelector("#lang")?.addEventListener("click",()=>{u=u==="cn"?"en":"cn",h()}),document.querySelector("#narrate")?.addEventListener("click",G),document.querySelector("#priority-filter")?.addEventListener("change",e=>{_=e.target.value,h()}),document.querySelector("#route-progress")?.addEventListener("input",e=>{v(Number(e.target.value)),f=!1,h()})}async function j(){const[e,r,o]=await Promise.all([fetch(`${$}data/route-stops.csv`).then(t=>t.text()),fetch(`${$}data/attractions.csv`).then(t=>t.text()),fetch(`${$}data/route-points.geojson`).then(t=>t.json())]);d=I(k(e),o.features),S=k(r),h(),requestAnimationFrame(N)}function N(){f&&!x&&d.length&&(y=(y+8e-4)%1,p=Math.round(y*(d.length-1)),L()),requestAnimationFrame(N)}window.addEventListener("resize",L);j().catch(e=>{P.innerHTML=`<main class="error"><h1>Travel guide failed to load</h1><pre>${l(String(e))}</pre></main>`});
