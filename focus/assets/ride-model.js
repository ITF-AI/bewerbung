"use strict";
(function(root){
  const routes={
    commute:{name:"Arbeitsweg · hin & zurück",terrain:"Wald und befestigte Wege",speed:20,paths:"M 200 450 C 300 430 250 310 390 295 S 470 170 575 180 S 740 250 680 360 S 460 490 200 450",segments:[{name:"Hinweg · Uferverbindung",km:5.8,up:30,surface:"Befestigt",factor:1},{name:"Hinweg · Waldanstieg",km:3.4,up:120,surface:"Schotter",factor:1.18},{name:"Rückweg · Höhenweg",km:5.8,up:60,surface:"Schotter",factor:1.18},{name:"Rückweg · nach Hause",km:3.4,up:20,surface:"Befestigt",factor:1}]},
    nature:{name:"Feierabend · Naturrunde",terrain:"Schotter und Wald",speed:17,paths:"M 200 450 C 150 320 260 230 380 270 S 470 100 600 155 S 810 290 680 360 S 450 530 200 450",segments:[{name:"Ausrollen am Wasser",km:5.5,up:35,surface:"Befestigt",factor:1},{name:"Aufstieg im Wald",km:6.2,up:210,surface:"Schotter",factor:1.18},{name:"Panorama und Abfahrt",km:5.8,up:40,surface:"Schotter",factor:1.18},{name:"Rückweg durch die Ebene",km:4.5,up:15,surface:"Befestigt",factor:1}]},
    trail:{name:"Abenteuer · Geländerunde",terrain:"Technisch anspruchsvoller",speed:14,paths:"M 200 450 C 145 310 280 185 380 230 S 380 90 500 100 S 600 240 720 205 S 840 390 680 360 S 490 530 200 450",segments:[{name:"Anfahrt zum Gelände",km:6.8,up:80,surface:"Befestigt",factor:1},{name:"Langer Schotteranstieg",km:7.2,up:350,surface:"Schotter",factor:1.18},{name:"Trail und Gegenanstiege",km:6.1,up:160,surface:"Trail · Demo",factor:1.45},{name:"Rückweg zum Ausgangspunkt",km:6.5,up:30,surface:"Befestigt",factor:1}]}
  };
  const weather={
    dry:{name:"Trocken und mild",factor:1,delay:0,uncertainty:.25,level:"good",message:"Im trockenen Beispielszenario ist kein zusätzlicher Wetterkonflikt hinterlegt. Das ist keine aktuelle Wetterauskunft.",cards:[["Start","16 °C · trocken","Gute Sicht im Beispielszenario."],["+30 Min.","17 °C · leichter Wind","Gleichmäßige Bedingungen angenommen."],["Rückweg","15 °C · trocken","Rückweg ist in der Rechnung enthalten."]]},
    wind:{name:"Windiger Rückweg",factor:1.22,delay:12,uncertainty:.3,level:"warn",message:"Im Beispielszenario nimmt auf dem Rückweg der Gegenwind zu. Der Modellverbrauch und die Fahrzeit steigen.",cards:[["Start","15 °C · leichter Wind","Normale Bedingungen auf dem Hinweg."],["+30 Min.","Wind nimmt zu","Zusätzliche Anstrengung eingeplant."],["Rückweg","Gegenwind · Demo","Energiereserve vor dem Rückweg prüfen."]]},
    rain:{name:"Regen im Tourverlauf",factor:1.12,delay:15,uncertainty:.35,level:"warn",message:"Das Regenszenario erhöht den Modellverbrauch auf der gesamten Runde pauschal. Der reale Zustand unbefestigter Wege ist unbekannt.",cards:[["Start","14 °C · bewölkt","Regen im weiteren Verlauf simuliert."],["+30 Min.","Regen · Demo","Befestigte Route wäre zu prüfen."],["Rückweg","Nasser Untergrund möglich","Keine gemessene Aussage zur Befahrbarkeit."]]},
    storm:{name:"Unwetterwarnung · Simulation",factor:1.3,delay:25,uncertainty:.4,level:"bad",message:"Eine Unwetterwarnung wird hier nur simuliert. In einem solchen Fall wäre die Tour neu zu bewerten; eine Alternativroute ist kein Nachweis für Sicherheit.",cards:[["Start","Warnlage · Demo","Keine echte amtliche Warnung."],["+30 Min.","Gewitter im Szenario","Tour verschieben oder abbrechen prüfen."],["Rückweg","Warnlage betrifft die Runde","Es wird keine sichere Ausweichroute zugesagt."]]}
  };
  const supports={eco:.65,tour:1,sport:1.35};
  function bounded(value,min,max,fallback){const n=typeof value==="number"||typeof value==="string"?Number(value):NaN;return Number.isFinite(n)?Math.max(min,Math.min(max,n)):fallback;}
  function calculate(raw){
    raw=raw||{};
    const route=routes[raw.route]||routes.nature;
    const wx=weather[raw.weather]||weather.dry;
    const nominal=bounded(raw.capacity,200,1500,625);
    const health=bounded(raw.health,50,100,90)/100;
    const battery=bounded(raw.battery,0,100,65);
    const reserve=bounded(raw.reserve,0,80,20);
    const mass=bounded(raw.mass,55,220,110);
    const assist=supports[raw.assist]||supports.tour;
    const usable=nominal*health;
    const available=usable*battery/100;
    const segments=route.segments.map(function(segment){
      const flat=segment.km*4.1*segment.factor*Math.pow(mass/110,.35);
      const climb=mass*9.81*segment.up/3600*.6/.78;
      const wh=(flat+climb)*assist*wx.factor;
      return Object.assign({},segment,{wh:wh});
    });
    const wh=segments.reduce(function(total,s){return total+s.wh;},0);
    const whLow=wh*(1-wx.uncertainty),whHigh=wh*(1+wx.uncertainty);
    function remaining(cost){return Math.max(0,(available-cost)/usable*100);}
    const end=remaining(wh),endLow=remaining(whHigh),endHigh=remaining(whLow);
    const deficit=Math.max(0,whHigh-available);
    const status=wx.level==="bad"||available<whHigh?"bad":endLow<reserve?"warn":"good";
    return {route:route,weather:wx,segments:segments,km:segments.reduce(function(t,s){return t+s.km;},0),up:segments.reduce(function(t,s){return t+s.up;},0),minutes:Math.round(segments.reduce(function(t,s){return t+s.km;},0)/route.speed*60+wx.delay),nominal:nominal,health:health,usable:usable,battery:battery,reserve:reserve,mass:mass,available:available,wh:wh,whLow:whLow,whHigh:whHigh,end:end,endLow:endLow,endHigh:endHigh,deficit:deficit,status:status};
  }
  root.RideModel={routes:routes,weather:weather,calculate:calculate};
})(typeof window!=="undefined"?window:globalThis);
