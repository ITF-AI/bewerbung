"use strict";
(function(){
  const form=document.getElementById("ride-form");
  if(!form||!window.RideModel)return;
  let selected="nature",current=null;
  const fmt=function(v,d){return Number(v).toLocaleString("de-DE",{maximumFractionDigits:d||0});};
  const text=function(id,value){document.getElementById(id).textContent=value;};
  function render(){
    const data={route:selected};
    Array.from(form.elements).forEach(function(el){if(el.name)data[el.name]=el.value;});
    current=RideModel.calculate(data);
    ["battery","reserve","mass","health"].forEach(function(name){const suffix=name==="mass"?" kg":" %";text(name+"-value",fmt(data[name])+suffix);});
    document.querySelectorAll("[data-route]").forEach(function(btn){btn.setAttribute("aria-pressed",String(btn.dataset.route===selected));});
    text("route-title",current.route.name);text("route-terrain",current.route.terrain);
    document.getElementById("route-path").setAttribute("d",current.route.paths);
    text("distance",fmt(current.km,1)+" km");text("ascent",fmt(current.up)+" hm");text("duration",fmt(current.minutes)+" Min.");
    text("arrival",fmt(current.endLow)+"–"+fmt(current.endHigh)+" %");
    document.getElementById("battery-fill").style.width=current.end+"%";
    text("energy-total",fmt(current.whLow)+"–"+fmt(current.whHigh)+" Wh");
    text("available",fmt(current.available)+" Wh");
    text("usable-capacity",fmt(current.usable)+" Wh");
    const panel=document.getElementById("ride-status");panel.dataset.state=current.status;
    let title="Reserve im Beispielszenario ausreichend",message="Auch am oberen Rand der Verbrauchsschätzung bleiben mindestens "+fmt(current.reserve)+" % Akkureserve. Diese Rechnung ist noch nicht mit echten Fahrdaten validiert.";
    if(current.weather.level==="bad"){title="Tour wegen simulierter Warnlage neu bewerten";message="Die Demo zeigt, wie eine Warnung die Tourentscheidung beeinflusst. Es liegen keine Live-Wetterdaten vor.";}
    else if(current.deficit>0){title="Für diese Runde könnte der Akku nicht reichen";message="Am oberen Rand der Schätzung fehlen "+fmt(current.deficit)+" Wh. Eine kürzere Runde oder mehr Ladung wäre zu prüfen.";}
    else if(current.endLow<current.reserve){title="Gewünschte Reserve könnte unterschritten werden";message="Am oberen Rand der Schätzung bleiben "+fmt(current.endLow)+" % statt der gewünschten "+fmt(current.reserve)+" %. Unterstützung, Route oder Ladestand anpassen.";}
    text("status-title",title);text("status-message",message);
    const tbody=document.getElementById("segment-rows");tbody.replaceChildren();
    current.segments.forEach(function(s){const tr=document.createElement("tr");[s.name,fmt(s.km,1)+" km",fmt(s.up)+" hm",s.surface,fmt(s.wh)+" Wh"].forEach(function(value){const td=document.createElement("td");td.textContent=value;tr.appendChild(td);});tbody.appendChild(tr);});
    const weather=document.getElementById("weather-cards");weather.replaceChildren();
    current.weather.cards.forEach(function(item){const card=document.createElement("div");card.className="weather-card";const time=document.createElement("span");time.style.fontSize="11px";time.textContent=item[0];const strong=document.createElement("strong");strong.textContent=item[1];const p=document.createElement("p");p.textContent=item[2];card.append(time,strong,p);weather.appendChild(card);});
    text("weather-message",current.weather.message);
    const focus=data.brand==="focus";
    text("extra-title",focus?"FOCUS-Modellwissen · Konzeptvorschau":"Dein Bike · Basisprofil");
    text("extra-copy",focus?"Geplant: Hinweise zu Ausstattung, Einrichtung und Service des konkreten FOCUS-Modells. In dieser Demo ist kein Herstellerkonto verbunden.":"Die Tour- und Wetterfunktionen bleiben verfügbar. Geplant ist zusätzliche Telemetrie, wenn für dein Modell ein unterstützter Zugang vorliegt.");
    text("assistant-answer","Wähle eine Frage. Die Antwort wird aus den aktuellen Demo-Einstellungen erzeugt.");
  }
  form.addEventListener("input",render);
  document.querySelectorAll("[data-route]").forEach(function(btn){btn.addEventListener("click",function(){selected=btn.dataset.route;render();});});
  document.querySelectorAll("[data-ask]").forEach(function(btn){btn.addEventListener("click",function(){let answer="";
    if(btn.dataset.ask==="reserve"){answer="Die vollständige Runde inklusive Rückweg benötigt im Modell "+fmt(current.whLow)+"–"+fmt(current.whHigh)+" Wh. Verfügbar sind "+fmt(current.available)+" Wh; die berechnete Ankunft liegt zwischen "+fmt(current.endLow)+" und "+fmt(current.endHigh)+" %. Eine reale Reichweitenzusage ist das nicht.";}
    if(btn.dataset.ask==="weather"){answer=current.weather.message+" Die Datenquelle ist hier ein manuell ausgewähltes Testszenario.";}
    if(btn.dataset.ask==="service"){answer="Der Prototyp erinnert an dokumentierte Prüfungen. Ohne Messung oder Kontrolle kann er weder Belagstärke noch einen exakten Wechseltermin feststellen. Prüfe die Hinweise des Komponentenherstellers und lass Auffälligkeiten fachlich beurteilen.";}
    text("assistant-answer",answer);
  });});
  document.querySelectorAll("[data-care]").forEach(function(btn){btn.addEventListener("click",function(){const done=btn.getAttribute("aria-pressed")==="true";btn.setAttribute("aria-pressed",String(!done));btn.textContent=done?"Demo: geprüft":"Demo: vermerkt";text("care-status",done?"Demo-Vermerk entfernt.":"Prüfung als Demo vermerkt. Es wurde keine reale Prüfung durchgeführt oder dauerhaft gespeichert.");});});
  document.getElementById("reset-demo").addEventListener("click",function(){form.reset();selected="nature";document.querySelectorAll("[data-care]").forEach(function(btn){btn.setAttribute("aria-pressed","false");btn.textContent="Demo: geprüft";});text("care-status","Prüfvermerke gelten nur für diese geöffnete Demo.");render();});
  document.getElementById("download-plan").addEventListener("click",function(){
    const snapshot={title:"FOCUS Ride Companion – Demo-Fahrplan",dataStatus:"Simulierte Route, manuell gewähltes Wetter, keine Bike-Verbindung; keine Navigation oder Reichweitenzusage.",route:current.route.name,kilometres:current.km,ascentMetres:current.up,estimatedWh:[Math.round(current.whLow),Math.round(current.whHigh)],arrivalPercent:[Math.floor(current.endLow),Math.ceil(current.endHigh)],desiredReserve:current.reserve,weather:current.weather.name,segments:current.segments};
    const url=URL.createObjectURL(new Blob([JSON.stringify(snapshot,null,2)],{type:"application/json"}));const a=document.createElement("a");a.href=url;a.download="ride-companion-demo-fahrplan.json";document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},1000);text("export-status","Demo-Fahrplan als JSON zum Download bereitgestellt.");
  });
  render();
})();
