(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))t(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const d of s.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&t(d)}).observe(document,{childList:!0,subtree:!0});function o(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function t(n){if(n.ep)return;n.ep=!0;const s=o(n);fetch(n.href,s)}})();const j=[["3","3 days"],["5","5 days"],["7","7 days"],["10","10 days"],["15","15 days"],["21","21 days"],["30","30 days"],["45","45 days"],["60","60 days"],["90_plus","90+ days"],["full","Full Grand Tour"]],q=["Autumn Colors","Mountains & Alps","Nature","Scenic Driving","Ancient History","Castles & Royal Europe","Art & Museums","Architecture & Churches","Coast & Fjords","Photography","Wine & Countryside","First-Time Europe Essentials"],B=["North America","South America","Africa","East Asia","South East Asia","China","India","Russia","East / Middle East","Arabic World"],U=["Target 120-180 mi/day on scenic travel days.","Comfortable upper target is about 220 mi/day on ordinary transfer days.","Avoid consecutive upper-limit drive days where possible.","Protect 2+ nights at high-value autumn or weather-sensitive bases.","Count parking, check-in, ferry, border, walking and reservation pressure as travel burden.","Do not schedule major scenic roads after dark."];function V(e){return{city_id:e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""),name:e,coordinate:{latitude:0,longitude:0,coordinate_precision:"approximate",coordinate_source:"CONTENT_PENDING",coordinate_verified_date:"CONTENT_PENDING"},first_time_summary:"CONTENT_PENDING",signature_story:"CONTENT_PENDING",recommended_nights:0,first_time_duration_guides:{"1_day":w("1-day must-see guide is awaiting approved research."),"2_days":w("2-day city-understanding guide is awaiting approved research."),"3_days":w("3-day complete first-visit guide is awaiting approved research."),"4_plus_days":w("4+ day relaxed/deeper guide is awaiting approved research.")},sources:[],status:"CONTENT_PENDING"}}function w(e){return{pace:"relaxed_balanced",must_see:[],schedule:[{label:"Approved research pack required",time_range:"CONTENT_PENDING",visit_duration:"recovery",status:"CONTENT_PENDING"}],notes:e,status:"CONTENT_PENDING"}}function F(e){const r=e.driveMiles?Math.max(.5,e.driveMiles/48):0,o=e.mountainRoadHours??0,t=e.majorAttractions??0,n=e.walkingHours??1.5,s=Math.min(100,Math.round(r*8+o*9+n*4+t*10+(e.hotelChange?12:0)+(e.ferry?10:0)));return{drive_miles:e.driveMiles,drive_hours:Number(r.toFixed(1)),mountain_road_hours:o,border_crossing:!1,ferry:!!e.ferry,hotel_change:e.hotelChange,major_attractions:t,walking_hours:n,reservation_pressure:t>1?"medium":"low",burden_score:s}}const N={title:"Europe Autumn Grand Tour",subtitle:"3D Virtual Road Trip Across Europe",myMapsOpen:"https://www.google.com/maps/d/edit?mid=1msDendyXwmU4o2SLgb1RbBBB7nJCBa4"},C="/travel-guide/",W=[{name:"03 DRIVE 1",from:"Amsterdam",to:"Lillehammer",opensAt:"Amsterdam"},{name:"04 DRIVE 2",from:"Lillehammer",to:"Warsaw",opensAt:"Lillehammer"},{name:"05 DRIVE 3",from:"Warsaw",to:"Grindelwald",opensAt:"Warsaw"},{name:"06 DRIVE 4",from:"Grindelwald",to:"Porto",opensAt:"Grindelwald"},{name:"07 DRIVE 5",from:"Porto",to:"Port of Barcelona",opensAt:"Porto"},{name:"08 DRIVE 6",from:"Civitavecchia",to:"Shkodër",opensAt:"Rome"},{name:"09 DRIVE 7",from:"Shkodër",to:"Belgrade",opensAt:"Shkodër"},{name:"10 DRIVE 8",from:"Belgrade",to:"Amsterdam Schiphol",opensAt:"Belgrade"}],D=document.querySelector("#app");let g=[],T=[],m=0,E="All",f="cn",S="daylight",c={duration:"full",visitorProfile:"first_time",pace:"relaxed",drivingPreference:"relaxed_self_drive",theme:"Autumn Colors"},b=0,v=!0,H=window.matchMedia("(prefers-reduced-motion: reduce)").matches;function P(e){const r=[];let o=[],t="",n=!1;for(let d=0;d<e.length;d+=1){const u=e[d],l=e[d+1];u==='"'&&n&&l==='"'?(t+='"',d+=1):u==='"'?n=!n:u===","&&!n?(o.push(t),t=""):(u===`
`||u==="\r")&&!n?(u==="\r"&&l===`
`&&(d+=1),o.push(t),o.some(a=>a.trim())&&r.push(o),o=[],t=""):t+=u}(t||o.length)&&(o.push(t),r.push(o));const s=r.shift()??[];return r.map(d=>Object.fromEntries(s.map((u,l)=>[u,d[l]??""])))}function k(e){return`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e)}`}function M(e){return`https://earth.google.com/web/search/${encodeURIComponent(e)}`}function R(e){return`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${encodeURIComponent(e)}`}function z(e,r){return`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${e},${r}`}function x(e,r){try{const o=new URL(e);return o.protocol==="https:"||o.protocol==="http:"?o.toString():r}catch{return r}}function i(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function K(e,r){const o=new Map;return r.forEach(t=>{const n=t.properties.name.replace(/^Leg \d+:\s*/,"").split(",")[0].trim();o.set(n.toLowerCase(),t.geometry.coordinates)}),e.map((t,n)=>{const s=o.get(t.Map_Name.toLowerCase())??X(t.Map_Name,n);return{...t,lng:s[0],lat:s[1]}})}function X(e,r){const o={Giethoorn:[6.083,52.74],Lübeck:[10.687,53.866],Flåm:[7.114,60.861],Geiranger:[7.207,62.101],Lillehammer:[10.466,61.115],Karlstad:[13.511,59.402],Jönköping:[14.161,57.782],Helsingborg:[12.694,56.046],Odense:[10.388,55.403],Schwerin:[11.413,53.635],Poznań:[16.925,52.406],Olomouc:[17.251,49.594],"Český Krumlov":[14.315,48.812],Hallstatt:[13.649,47.562],Salzburg:[13.055,47.81],Ortisei:[11.674,46.576],"St. Moritz":[9.839,46.498],Grindelwald:[8.041,46.624],"Chamonix-Mont-Blanc":[6.869,45.923],Annecy:[6.129,45.899],Avignon:[4.805,43.949],Collioure:[3.083,42.526],Zaragoza:[-.889,41.648],Salamanca:[-5.664,40.97],Évora:[-7.913,38.571],Granada:[-3.599,37.178],Alicante:[-.481,38.345],Valencia:[-.376,39.469],"Port of Barcelona":[2.173,41.353],"Port of Civitavecchia":[11.795,42.094],Venice:[12.315,45.44],Ljubljana:[14.505,46.056],"Plitvice Lakes National Park":[15.582,44.865],Split:[16.44,43.508],Dubrovnik:[18.094,42.651],Kotor:[18.771,42.424],Shkodër:[19.512,42.069],Gjirokastër:[20.138,40.075],Ioannina:[20.851,39.665],Patras:[21.735,38.246],Athens:[23.728,37.984],Delphi:[22.501,38.482],Meteora:[21.63,39.721],Skopje:[21.431,41.998],Niš:[21.896,43.321],Belgrade:[20.457,44.817],"Novi Sad":[19.833,45.267],Linz:[14.286,48.306],Regensburg:[12.102,49.013],Würzburg:[9.953,49.792],Bacharach:[7.769,50.057],Cologne:[6.96,50.938],"Amsterdam Airport Schiphol":[4.763,52.31]};return o[e]?o[e]:[4+r*.22,52-r*.04]}function Y(e,r,o,t){const l=(e- -10)/36*o,a=t-(r-36)/28*t;return{x:l,y:a}}function L(){const e=document.querySelector("#route-canvas");if(!e||!g.length)return;const r=e.getBoundingClientRect(),o=Math.min(window.devicePixelRatio||1,2);e.width=Math.floor(r.width*o),e.height=Math.floor(r.height*o);const t=e.getContext("2d");t.scale(o,o),t.clearRect(0,0,r.width,r.height);const n=t.createLinearGradient(0,0,r.width,r.height);n.addColorStop(0,"#17324d"),n.addColorStop(.55,"#23556a"),n.addColorStop(1,"#6a8d6d"),t.fillStyle=n,t.fillRect(0,0,r.width,r.height),t.save(),t.globalAlpha=.2,t.strokeStyle="#d7e7db";for(let l=0;l<18;l+=1)t.beginPath(),t.moveTo(0,l*38+10),t.lineTo(r.width,l*28-40),t.stroke();for(let l=0;l<20;l+=1)t.beginPath(),t.moveTo(l*58-100,0),t.lineTo(l*42+40,r.height),t.stroke();t.restore();const s=g.map(l=>Y(l.lng,l.lat,r.width,r.height));t.lineCap="round",t.lineJoin="round",t.strokeStyle="rgba(8, 22, 38, .55)",t.lineWidth=10,$(t,s),t.strokeStyle="#ffffff",t.lineWidth=5,$(t,s),t.strokeStyle="#2d8cff",t.lineWidth=3,$(t,s);const d=Math.max(1,Math.floor(b*(s.length-1)));t.strokeStyle="#ffcf5a",t.lineWidth=6,$(t,s.slice(0,d+1)),s.forEach((l,a)=>{const p=a===m;t.beginPath(),t.fillStyle=p?"#ff7a1a":"#1fb67a",t.strokeStyle="#fff",t.lineWidth=p?4:2,t.arc(l.x,l.y,p?8:5,0,Math.PI*2),t.fill(),t.stroke()});const u=s[m];u&&(t.beginPath(),t.strokeStyle="#ffcf5a",t.lineWidth=2,t.arc(u.x,u.y,18+Math.sin(Date.now()/260)*4,0,Math.PI*2),t.stroke())}function $(e,r){r.length&&(e.beginPath(),e.moveTo(r[0].x,r[0].y),r.slice(1).forEach(o=>e.lineTo(o.x,o.y)),e.stroke())}function J(){const e=g[m],r=T.filter(o=>Number(o.Stop_Order)===Number(e.Order));return E==="All"?r:r.filter(o=>o.Priority===E)}function Z(e){const r=Number(e.Recommended_Nights||0),o=Number(e.Approx_Miles_From_Previous||0),t=T.some(n=>Number(n.Stop_Order)===Number(e.Order));return r<=1&&o>=120?{route_function:"Route protection / relaxed self-drive pacing",why_stop_exists:"This stop keeps the road trip comfortable instead of turning the day into a bus-tour transfer.",worth_sightseeing:t?"Local guide items exist.":"CONTENT_PENDING",best_60_minute_experience:t?"Use the highest-priority nearby guide item.":"CONTENT_PENDING",skip_if_tired:"Dinner, sleep, and continue without guilt."}:{route_function:e.Route_Theme||"Destination base",why_stop_exists:e.Why_This_Stop||"CONTENT_PENDING",worth_sightseeing:t?"Yes, use the attraction guide below.":"CONTENT_PENDING",best_60_minute_experience:t?"Pick one nearby priority attraction.":"CONTENT_PENDING",skip_if_tired:"Protect rest when arrival is late or weather is poor."}}function Q(e){const r=e.toLowerCase(),o=g.findIndex(t=>t.Map_Name.toLowerCase()===r||t.Map_Name.toLowerCase().includes(r)||t.Location.toLowerCase().includes(r));return Math.max(0,o)}function ee(e){const r=e.toLowerCase(),o=g.findIndex(t=>t.Map_Name.toLowerCase()===r||t.Map_Name.toLowerCase().includes(r)||t.Location.toLowerCase().includes(r));return o>=0?o:g.length-1}function y(e){m=Math.max(0,Math.min(g.length-1,e)),b=m/Math.max(1,g.length-1)}function te(){const e=g[m],r=f==="cn"?`${e.Map_Name}。${e.Why_This_Stop} 秋季窗口：${e.Autumn_Target_Window}。`:`${e.Map_Name}. ${e.Country}. Autumn window: ${e.Autumn_Target_Window}. ${e.Route_Theme}.`;window.speechSynthesis.cancel();const o=new SpeechSynthesisUtterance(r);o.lang=f==="cn"?"zh-CN":"en-US",window.speechSynthesis.speak(o)}function h(){const e=g[m],r=J(),o=V(e.Map_Name),t=Z(e),n=F({driveMiles:Number(e.Approx_Miles_From_Previous||0),hotelChange:m>0,ferry:e.Map_Name.toLowerCase().includes("ferry")||e.Location.toLowerCase().includes("port"),majorAttractions:Math.min(2,r.length),walkingHours:r.length?2.5:1}),s=["All",...Array.from(new Set(T.map(a=>a.Priority))).filter(Boolean)],d=k(e.Location),u=M(e.Location),l=typeof e.lat=="number"&&typeof e.lng=="number"?z(e.lat,e.lng):R(e.Location);D.innerHTML=`
    <main class="${S==="night"?"night-mode":"daylight-mode"}">
      <section class="hero">
        <div class="hero__copy">
          <p class="eyebrow">PUBLIC TRAVEL GUIDE PLATFORM</p>
          <h1>${i(N.title)}</h1>
          <p>${i(N.subtitle)}</p>
          <div class="hero__actions">
            <a class="button primary" href="${N.myMapsOpen}" target="_blank" rel="noreferrer">Open My Maps</a>
            <a class="button" href="${u}" target="_blank" rel="noreferrer">Google Earth 3D</a>
          </div>
        </div>
        <canvas id="route-canvas" aria-label="3D route fly-through canvas"></canvas>
      </section>

      <section class="toolbar" aria-label="Trip controls">
        <button id="prev-stop" class="icon-btn" title="Previous stop">‹</button>
        <input id="route-progress" type="range" min="0" max="${g.length-1}" value="${m}" />
        <button id="next-stop" class="icon-btn" title="Next stop">›</button>
        <button id="play" class="button">${v?"Pause flight":"Play flight"}</button>
        <button id="mode" class="button">${S==="daylight"?"Night mode":"Daylight"}</button>
        <button id="lang" class="button">${f==="cn"?"中文":"English"}</button>
        <button id="narrate" class="button">Narration</button>
      </section>

      <section class="planner" aria-label="Trip compiler controls">
        <label>Duration
          <select id="duration">
            ${j.map(([a,p])=>`<option value="${a}" ${c.duration===a?"selected":""}>${p}</option>`).join("")}
          </select>
        </label>
        <label>Visitor
          <select id="visitor-profile">
            <option value="first_time" ${c.visitorProfile==="first_time"?"selected":""}>First Time</option>
            <option value="return_visitor" ${c.visitorProfile==="return_visitor"?"selected":""}>Return Visitor</option>
          </select>
        </label>
        <label>Pace
          <select id="pace">
            <option value="relaxed" ${c.pace==="relaxed"?"selected":""}>Relaxed</option>
            <option value="balanced" ${c.pace==="balanced"?"selected":""}>Balanced</option>
            <option value="see_more" ${c.pace==="see_more"?"selected":""}>See More</option>
          </select>
        </label>
        <label>Drive
          <select id="drive-profile">
            <option value="relaxed_self_drive" ${c.drivingPreference==="relaxed_self_drive"?"selected":""}>Relaxed Self-Drive</option>
            <option value="comfortable_road_trip" ${c.drivingPreference==="comfortable_road_trip"?"selected":""}>Comfortable Road Trip</option>
            <option value="fast_mover" ${c.drivingPreference==="fast_mover"?"selected":""}>Fast Mover</option>
          </select>
        </label>
        <label>Theme
          <select id="theme">
            ${q.map(a=>`<option value="${i(a)}" ${c.theme===a?"selected":""}>${i(a)}</option>`).join("")}
          </select>
        </label>
      </section>

      <section class="layout">
        <aside class="stops" aria-label="Route stops">
          ${W.map(({name:a,from:p,to:_,opensAt:O})=>{const A=Q(O),G=ee(_);return`
                  <button class="drive-chip ${m>=A&&m<=G?"active":""}" data-drive="${A}">
                    <strong>${i(a)}</strong>
                    <span>${i(p)} → ${i(_)}</span>
                  </button>
                `}).join("")}
          <div class="stop-list">
            ${g.map((a,p)=>`
                  <button class="stop-row ${p===m?"active":""}" data-stop="${p}">
                    <span>${i(a.Order.padStart(2,"0"))}</span>
                    <strong>${i(a.Map_Name)}</strong>
                    <small>${i(a.Country)} · ${i(a.Autumn_Priority)}</small>
                  </button>
                `).join("")}
          </div>
        </aside>

        <section class="guide">
          <div class="guide__header">
            <div>
              <p class="eyebrow">STOP ${i(e.Order)} · ${i(e.Country)}</p>
              <h2>${i(e.Map_Name)}</h2>
            </div>
            <div class="guide__links">
              <a href="${d}" target="_blank" rel="noreferrer">Maps</a>
              <a href="${u}" target="_blank" rel="noreferrer">Earth</a>
              <a href="${l}" target="_blank" rel="noreferrer">Street View</a>
            </div>
          </div>
          <div class="facts">
            <span>${i(e.Recommended_Nights||"0")} nights</span>
            <span>${i(e.Drive_Class)}</span>
            <span>${i(e.Approx_Miles_From_Previous)} mi from previous</span>
            <span>${i(e.Autumn_Target_Window)}</span>
          </div>
          <p class="lead">${i(f==="cn"?e.Why_This_Stop:`${e.Route_Theme}. This stop anchors the route in ${e.Country} and sets up the next drive segment.`)}</p>

          <section class="info-grid">
            <article class="info-panel">
              <p class="eyebrow">WHY THIS STOP EXISTS</p>
              <h3>${i(t.route_function)}</h3>
              <dl>
                <dt>Why stop</dt>
                <dd>${i(t.why_stop_exists)}</dd>
                <dt>60-minute plan</dt>
                <dd>${i(t.best_60_minute_experience)}</dd>
                <dt>Skip rule</dt>
                <dd>${i(t.skip_if_tired)}</dd>
              </dl>
            </article>
            <article class="info-panel">
              <p class="eyebrow">RELAXED SELF-DRIVE</p>
              <h3>Daily burden ${n.burden_score}/100</h3>
              <dl>
                <dt>Drive</dt>
                <dd>${n.drive_miles} mi · ${n.drive_hours} hr estimate</dd>
                <dt>Hotel change</dt>
                <dd>${n.hotel_change?"Yes":"No"} · attractions planned: ${n.major_attractions}</dd>
                <dt>Rule</dt>
                <dd>${i(U[0])}</dd>
              </dl>
            </article>
          </section>

          <section class="duration-ladder">
            <div class="section-heading">
              <div>
                <p class="eyebrow">CITY DURATION LADDER</p>
                <h3>${i(o.name)} first-time plans</h3>
              </div>
              <span class="status-pill">${o.status}</span>
            </div>
            <div class="ladder-grid">
              ${Object.entries(o.first_time_duration_guides).map(([a,p])=>`
                    <article class="ladder-card">
                      <strong>${i(a.replaceAll("_"," "))}</strong>
                      <span>${i(p.pace)}</span>
                      <p>${i(p.notes)}</p>
                      <small>${i(p.schedule[0]?.time_range??"CONTENT_PENDING")}</small>
                    </article>
                  `).join("")}
            </div>
          </section>

          <section class="compiler-panel">
            <p class="eyebrow">TRIP COMPILER ENGINE</p>
            <h3>${c.duration==="full"?"Full Grand Tour":`${c.duration.replace("_plus","+")} days`} · ${i(c.theme)}</h3>
            <p>
              Compiler skeleton is active. Approved city-duration packs will become the building blocks here;
              missing packs stay marked CONTENT_PENDING instead of being invented.
            </p>
          </section>

          <section class="region-roadmap">
            <div class="section-heading">
              <div>
                <p class="eyebrow">FUTURE REGION BUILDS</p>
                <h3>Global guide engine roadmap</h3>
              </div>
              <span class="status-pill">CONTENT_PENDING</span>
            </div>
            <div class="region-grid">
              ${B.map(a=>`<span>${i(a)}</span>`).join("")}
            </div>
          </section>

          <section class="help-contact">
            <div>
              <p class="eyebrow">HELP & CONTACT</p>
              <h3>Ask the Travel Guide Team</h3>
              <p>
                This public guide is designed and operated by Ray's AI travel team. Ask questions about routes,
                city plans, autumn timing, pacing, or what to look for at each stop.
              </p>
            </div>
            <div class="team-grid">
              <article>
                <strong>ChatGPT</strong>
                <span>Content planner · research organizer · trip designer</span>
              </article>
              <article>
                <strong>Codex</strong>
                <span>Platform builder · site operator · guide engine maintainer</span>
              </article>
            </div>
            <div class="hero__actions">
              <a class="button primary" href="https://github.com/mailtoray-lgtm/travel-guide/issues" target="_blank" rel="noreferrer">Ask on GitHub</a>
              <a class="button" href="https://github.com/mailtoray-lgtm/travel-guide" target="_blank" rel="noreferrer">View Project</a>
            </div>
          </section>

          <div class="map-embed">
            <div>
              <p class="eyebrow">EXTERNAL MAPS</p>
              <h3>Continue in Google</h3>
              <p>
                The public guide keeps the route and attraction data available here, with direct handoff
                links for Google's map, Earth, and Street View experiences.
              </p>
              <div class="hero__actions">
                <a class="button primary" href="${N.myMapsOpen}" target="_blank" rel="noreferrer">Open My Maps</a>
                <a class="button" href="${d}" target="_blank" rel="noreferrer">Open Maps</a>
                <a class="button" href="${u}" target="_blank" rel="noreferrer">Open Earth</a>
                <a class="button" href="${l}" target="_blank" rel="noreferrer">Street View</a>
              </div>
            </div>
          </div>

          <div class="attraction-tools">
            <h3>${f==="cn"?"景点导游":"Attraction Guide"}</h3>
            <select id="priority-filter" aria-label="Filter attractions by priority">
              ${s.map(a=>`<option value="${i(a)}" ${a===E?"selected":""}>${i(a)}</option>`).join("")}
            </select>
          </div>

          <div class="attractions">
            ${r.length?r.map(a=>{const p=x(a.Google_Maps_Search_URL,k(a.Location)),_=a.Source_URL?x(a.Source_URL,""):"";return`
                        <article class="attraction-card">
                          <div>
                            <span class="priority">${i(a.Priority)}</span>
                            <h4>${i(a.Map_Name)}</h4>
                            <p>${i(f==="cn"?a.Story_Theme_CN:a.Location)}</p>
                          </div>
                          <dl>
                            <dt>${f==="cn"?"怎么玩":"How"}</dt>
                            <dd>${i(f==="cn"?a.How_To_Experience_CN:a.Recommended_Time)}</dd>
                            <dt>${f==="cn"?"看什么":"Look For"}</dt>
                            <dd>${i(f==="cn"?a.What_To_Look_For_CN:a.Best_Time)}</dd>
                            <dt>${f==="cn"?"秋季重点":"Autumn"}</dt>
                            <dd>${i(f==="cn"?a.Autumn_Focus_CN:a.Practical_Tip_CN)}</dd>
                          </dl>
                          <div class="card-links">
                            <a href="${p}" target="_blank" rel="noreferrer">Maps</a>
                            <a href="${M(a.Location)}" target="_blank" rel="noreferrer">Earth</a>
                            <a href="${R(a.Location)}" target="_blank" rel="noreferrer">Street View</a>
                            ${_?`<a href="${_}" target="_blank" rel="noreferrer">Source</a>`:""}
                          </div>
                        </article>
                      `}).join(""):'<p class="empty">No attractions are listed for this stop yet.</p>'}
          </div>
        </section>
      </section>
    </main>
  `,re(),L()}function re(){document.querySelectorAll("[data-stop]").forEach(e=>{e.addEventListener("click",()=>{y(Number(e.dataset.stop)),v=!1,h()})}),document.querySelectorAll("[data-drive]").forEach(e=>{e.addEventListener("click",()=>{y(Number(e.dataset.drive)),v=!1,h()})}),document.querySelector("#prev-stop")?.addEventListener("click",()=>{y(m-1),h()}),document.querySelector("#next-stop")?.addEventListener("click",()=>{y(m+1),h()}),document.querySelector("#play")?.addEventListener("click",()=>{v=!v,h()}),document.querySelector("#mode")?.addEventListener("click",()=>{S=S==="daylight"?"night":"daylight",h()}),document.querySelector("#lang")?.addEventListener("click",()=>{f=f==="cn"?"en":"cn",h()}),document.querySelector("#narrate")?.addEventListener("click",te),document.querySelector("#priority-filter")?.addEventListener("change",e=>{E=e.target.value,h()}),document.querySelector("#route-progress")?.addEventListener("input",e=>{y(Number(e.target.value)),v=!1,h()}),document.querySelector("#duration")?.addEventListener("change",e=>{c={...c,duration:e.target.value},h()}),document.querySelector("#visitor-profile")?.addEventListener("change",e=>{c={...c,visitorProfile:e.target.value},h()}),document.querySelector("#pace")?.addEventListener("change",e=>{c={...c,pace:e.target.value},h()}),document.querySelector("#drive-profile")?.addEventListener("change",e=>{c={...c,drivingPreference:e.target.value},h()}),document.querySelector("#theme")?.addEventListener("change",e=>{c={...c,theme:e.target.value},h()})}async function oe(){const[e,r,o]=await Promise.all([fetch(`${C}data/route-stops.csv`).then(t=>t.text()),fetch(`${C}data/attractions.csv`).then(t=>t.text()),fetch(`${C}data/route-points.geojson`).then(t=>t.json())]);g=K(P(e),o.features),T=P(r),h(),requestAnimationFrame(I)}function I(){v&&!H&&g.length&&(b=(b+8e-4)%1,m=Math.round(b*(g.length-1)),L()),requestAnimationFrame(I)}window.addEventListener("resize",L);oe().catch(e=>{D.innerHTML=`<main class="error"><h1>Travel guide failed to load</h1><pre>${i(String(e))}</pre></main>`});
