"use strict";
(function(){
  if(!window.RideModel)return;
  const state={screen:"home",route:"nature",weather:"dry",brand:"focus",capacity:625,battery:65,reserve:20,mass:110,health:90,assist:"tour",progress:0,running:false};
  let current=null,timer=null,toastTimer=null;
  const screens=["home","routes","map","bike","discover"];
  const t=function(id,value){const el=document.getElementById(id);if(el)el.textContent=value;};
  const fmt=function(n,d){return Number(n).toLocaleString("de-DE",{maximumFractionDigits:d||0});};
  const toast=function(message){const el=document.getElementById("toast");el.textContent=message;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(function(){el.hidden=true;},3500);};
  function showScreen(screen,hash){
    if(!screens.includes(screen))screen="home";
    state.screen=screen;
    document.querySelectorAll("[data-screen]").forEach(function(el){el.hidden=el.dataset.screen!==screen;});
    document.querySelectorAll(".bottom-nav [data-screen-target]").forEach(function(button){if(button.dataset.screenTarget===screen)button.setAttribute("aria-current","page");else button.removeAttribute("aria-current");});
    document.getElementById("app-scroll").scrollTo({top:0,behavior:"instant"});
    if(hash!==false){try{history.replaceState(null,"","#"+screen);}catch{}}
    if(screen==="map")drawRider();
  }
  function drawRider(){
    const path=document.getElementById("map-route"),rider=document.getElementById("map-rider");
    try{const point=path.getPointAtLength(path.getTotalLength()*state.progress);rider.setAttribute("cx",point.x);rider.setAttribute("cy",point.y);}catch{}
    const pct=Math.round(state.progress*100);t("simulation-progress",pct+" %");document.getElementById("ride-progress").value=pct;
    t("simulation-label",state.progress>=1?"Demo-Runde abgeschlossen":state.running?"Demo-Fahrt läuft":state.progress>0?"Demo-Fahrt pausiert":"Demo-Fahrt bereit");
    t("ride-toggle",state.running?"Simulation pausieren":state.progress>=1?"Erneut simulieren":state.progress>0?"Simulation fortsetzen":"Demo-Fahrt starten");
  }
  function pause(){clearInterval(timer);timer=null;state.running=false;drawRider();}
  function reset(){pause();state.progress=0;drawRider();}
  function render(){
    current=RideModel.calculate(state);
    document.querySelectorAll("[data-route]").forEach(function(btn){if(btn.hasAttribute("aria-pressed"))btn.setAttribute("aria-pressed",String(btn.dataset.route===state.route));});
    document.querySelectorAll("[data-weather]").forEach(function(btn){btn.setAttribute("aria-pressed",String(btn.dataset.weather===state.weather));});
    document.querySelectorAll("[data-battery]").forEach(function(el){el.textContent=fmt(state.battery)+" %";});
    const brand=state.brand==="focus"?"FOCUS E-MTB":"DEIN E-BIKE";
    t("home-bike-name",brand);t("bike-profile-name",brand);t("bike-capacity",fmt(state.capacity));t("bike-reserve",fmt(state.reserve)+" %");
    t("home-weather",current.weather.name);
    t("home-reserve","Für „"+current.route.name+"“ liegt die modellierte Ankunft bei "+fmt(current.endLow)+"–"+fmt(current.endHigh)+" % Akku.");
    t("plan-route-name",current.route.name);t("plan-km",fmt(current.km,1));t("plan-up",fmt(current.up));t("plan-time",fmt(current.minutes));
    t("plan-arrival",fmt(current.endLow)+"–"+fmt(current.endHigh)+" %");
    document.getElementById("plan-fill").style.width=current.end+"%";document.getElementById("reserve-mark").style.left=state.reserve+"%";
    t("plan-energy",fmt(current.whLow)+"–"+fmt(current.whHigh)+" Wh Verbrauch · "+fmt(current.available)+" Wh verfügbar. Gesamte Runde inklusive Rückweg.");
    const advice=document.getElementById("route-advice");advice.dataset.status=current.status;
    if(current.weather.level==="bad"){t("advice-title","WARNLAGE IM DEMOSZENARIO");t("advice-copy","Diese Runde neu bewerten. Es wird keine sichere Ausweichroute zugesagt. Keine aktuelle amtliche Warnung.");}
    else if(current.deficit>0){t("advice-title","DER AKKU KÖNNTE NICHT REICHEN.");t("advice-copy","Am oberen Rand der Modellschätzung fehlen "+fmt(current.deficit)+" Wh. Mehr Ladung, weniger Unterstützung oder eine kürzere Runde prüfen.");}
    else if(current.endLow<state.reserve){t("advice-title","MEHR RESERVE WÄRE SINNVOLL.");t("advice-copy","Die gewünschte Reserve von "+fmt(state.reserve)+" % könnte unterschritten werden. Einstellungen und Tour prüfen.");}
    else{t("advice-title","DEINE RESERVE IST MITGEDACHT.");t("advice-copy","Im Beispielszenario bleibt deine Zielreserve auch bei höherem Modellverbrauch erhalten. Noch keine reale Reichweitenzusage.");}
    const segments=document.getElementById("energy-segments");segments.replaceChildren();
    current.segments.forEach(function(segment){const row=document.createElement("div");row.className="segment-row";const label=document.createElement("span"),value=document.createElement("b");label.textContent=segment.name+" · "+fmt(segment.km,1)+" km";value.textContent=fmt(segment.wh)+" Wh";row.append(label,value);segments.appendChild(row);});
    t("map-route-title",current.route.name);t("map-km",fmt(current.km,1));t("map-minutes",fmt(current.minutes));t("map-arrival",fmt(current.endLow)+"–"+fmt(current.endHigh)+" %");
    t("map-weather",current.weather.name);t("map-weather-title",current.weather.name);
    t("map-weather-copy",state.weather==="dry"?"Szenario ändern und Tour neu bewerten.":current.weather.message);
    document.getElementById("map-route").setAttribute("d",current.route.paths);document.getElementById("map-route-shadow").setAttribute("d",current.route.paths);drawRider();
  }
  document.addEventListener("click",function(event){
    const target=event.target.closest("button,a");if(!target)return;
    const open=target.dataset.open;
    if(open){const dialog=document.getElementById(open);if(dialog&&!dialog.open)dialog.showModal();return;}
    if(target.hasAttribute("data-close-dialog")){target.closest("dialog").close();return;}
    if(target.dataset.route){state.route=target.dataset.route;reset();render();}
    if(target.dataset.screenTarget){showScreen(target.dataset.screenTarget);}
    if(target.dataset.weather){state.weather=target.dataset.weather;reset();render();document.getElementById("weather-dialog").close();toast("Wetterszenario geändert. Die Tour wurde neu berechnet.");}
    if(target.dataset.care){const done=target.getAttribute("aria-pressed")==="true";target.setAttribute("aria-pressed",String(!done));t("service-status",done?"Demo-Vermerk entfernt.":"Als Demo vermerkt. Es wurde keine reale Prüfung durchgeführt oder dauerhaft gespeichert.");}
  });
  document.querySelectorAll("dialog").forEach(function(dialog){dialog.addEventListener("click",function(e){if(e.target===dialog){const box=dialog.getBoundingClientRect();if(e.clientX<box.left||e.clientX>box.right||e.clientY<box.top||e.clientY>box.bottom)dialog.close();}});});
  document.getElementById("support").addEventListener("change",function(event){state.assist=event.target.value;reset();render();});
  const settings=document.getElementById("bike-settings");
  settings.addEventListener("input",function(){["battery","reserve","mass","health"].forEach(function(name){t(name+"-output",settings.elements[name].value+(name==="mass"?" kg":" %"));});});
  settings.addEventListener("submit",function(event){event.preventDefault();["brand","capacity","battery","reserve","mass","health"].forEach(function(name){state[name]=name==="brand"?settings.elements[name].value:Number(settings.elements[name].value);});reset();render();document.getElementById("settings-dialog").close();toast("Demoprofil übernommen. Die Tour wurde neu berechnet.");});
  document.getElementById("ride-toggle").addEventListener("click",function(){
    if(state.running){pause();return;}
    if(current.status==="bad"){toast("Bitte erst die Warnlage oder den zu niedrigen Akkustand im Tourenplan prüfen.");showScreen("routes");return;}
    if(state.progress>=1)state.progress=0;
    state.running=true;drawRider();timer=setInterval(function(){state.progress=Math.min(1,state.progress+.025);if(state.progress>=1){pause();toast("Demo-Runde abgeschlossen. Keine echte Fahrt aufgezeichnet.");}else drawRider();},800);
  });
  document.getElementById("ride-reset").addEventListener("click",function(){reset();});
  document.addEventListener("visibilitychange",function(){if(document.hidden&&state.running)pause();});
  document.getElementById("interests-form").addEventListener("submit",function(event){event.preventDefault();const interests=Array.from(event.target.querySelectorAll("input:checked")).map(function(el){return el.value;});t("interests-result",interests.length?"Demo-Auswahl: "+interests.join(", ")+". Keine Anmeldung, kein Versand und keine Speicherung.":"Keine Themen ausgewählt. Die Fahrerfunktionen bleiben nutzbar.");});
  window.addEventListener("hashchange",function(){showScreen(location.hash.slice(1),false);});
  render();showScreen(location.hash.slice(1)||"home",false);
})();
