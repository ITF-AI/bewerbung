const {test}=require('node:test');
const assert=require('node:assert/strict');
require('../assets/ride-model.js');
require('../assets/ride-live.js');
const L=globalThis.RideLive;
const now=Date.UTC(2026,10,18,10),start=now+600000;
const profile={capacity:625,health:90,battery:100,reserve:20,mass:110,assist:'tour'};
const spec={id:'test',name:'Testrunde',waypoints:[[9.59,47.67],[9.60,47.68],[9.59,47.67]]};
function route(){return L.normalizeRoute({features:[{geometry:{type:'LineString',coordinates:[[9.59,47.67,450],[9.60,47.68,475],[9.62,47.68,475],[9.59,47.67,450]]},properties:{'track-length':'10000','filtered ascend':'80','total-time':'1800',messages:[[],[0,0,0,1000,0,0,0,0,0,'surface=asphalt']]}}]},spec);}
function weather(changes={}){const time=Array.from({length:72},(_,i)=>Math.floor(now/86400000)*86400+i*3600),hourly={time};for(const [k,v]of Object.entries({temperature_2m:15,precipitation_probability:10,precipitation:0,weather_code:1,wind_speed_10m:4,wind_direction_10m:180,wind_gusts_10m:8,is_day:1,...changes}))hourly[k]=time.map(()=>v);return {hourly,timezone:'Europe/Berlin',daily:{sunrise:[Date.UTC(2026,10,18,7)/1000,Date.UTC(2026,10,19,7)/1000],sunset:[Date.UTC(2026,10,18,16)/1000,Date.UTC(2026,10,19,16)/1000]}};}
function assess(changes={},options={}){return L.assess(route(),Array.from({length:4},()=>weather(changes)),{...profile,...options.profile},start,options.warnings||{warnings:[]},options.available!==false,75);}
const polygon={type:'Polygon',coordinates:[[[9.58,47.66],[9.63,47.66],[9.63,47.69],[9.58,47.69],[9.58,47.66]]]};
function warning(changes={}){return {event:'STURMBÖEN',level:3,start:now,end:now+7200000,regions:[{polygonGeometry:polygon}],...changes};}
test('real distances and ascent are taken from the routing response',()=>{const r=route();assert.equal(r.km,10);assert.equal(r.up,80);assert.equal(r.minutes,30);assert.equal(r.points.length,4);});
test('good forecast and sufficient battery prepare a route',()=>{assert.equal(assess().status,'good');});
test('missing weather never becomes dry or a positive recommendation',()=>{const r=L.assess(route(),[],profile,start,{warnings:[]},true,75);assert.equal(r.status,'unknown');assert.ok(r.reasons.some(s=>s.includes('fehlen')));});
test('null measurements invalidate the forecast window',()=>{assert.equal(assess({temperature_2m:null}).status,'unknown');});
test('forecast beyond available time is not evaluated as safe',()=>{assert.equal(L.forecastWindow(weather(),now+4*86400000,now+4*86400000+60000),null);});
test('thunderstorms stop the recommendation',()=>{assert.equal(assess({weather_code:95}).status,'bad');});
test('freezing rain and snow stop the recommendation',()=>{assert.equal(assess({weather_code:66}).status,'bad');assert.equal(assess({weather_code:73}).status,'bad');});
test('dangerous gusts stop the recommendation',()=>{assert.equal(assess({wind_gusts_10m:65}).status,'bad');});
test('rain and darkness produce route-specific caution',()=>{assert.equal(assess({precipitation_probability:80,precipitation:.8}).status,'warn');const dark=weather();dark.daily.sunset=dark.daily.sunset.map(n=>n-6*3600);assert.equal(L.assess(route(),[dark,dark,dark,dark],profile,start,{warnings:[]},true,75).status,'warn');});
test('zero battery stops an otherwise good route',()=>{assert.equal(assess({}, {profile:{battery:0}}).status,'bad');});
test('unavailable official warnings keep the decision provisional',()=>{assert.equal(assess({}, {available:false}).status,'unknown');});
test('DWD warning is matched by geometry and trip time',()=>{assert.equal(assess({}, {warnings:{warnings:[warning()]}}).status,'bad');assert.equal(assess({}, {warnings:{warnings:[warning({end:now-1})]}}).status,'good');});
test('DWD altitude restrictions exclude warnings above the whole route',()=>{assert.equal(assess({}, {warnings:{warnings:[warning({altitudeStart:1000})]}}).status,'good');});
test('crossing a narrow warning polygon is detected between vertices',()=>{const narrow={type:'Polygon',coordinates:[[[9.614,47.679],[9.615,47.679],[9.615,47.681],[9.614,47.681],[9.614,47.679]]]};assert.equal(L.matchingWarnings({warnings:[warning({regions:[{polygonGeometry:narrow}]})]},route(),start,start+3600000).length,1);});
test('polygon holes are excluded',()=>{const withHole={type:'Polygon',coordinates:[polygon.coordinates[0],[[9.59,47.67],[9.61,47.67],[9.61,47.685],[9.59,47.685],[9.59,47.67]]]};assert.equal(L.pointInGeometry([9.60,47.68],withHole),false);});
test('automatic departure shifts a long afternoon ride to daylight next day',()=>{const date=L.departure(weather(),'auto',Date.UTC(2026,10,18,14,30),180);assert.equal(date,Date.UTC(2026,10,19,7,20));});
test('route candidates share a start and include a shorter alternative',()=>{const specs=L.routeSpecs({lat:47.67,lon:9.59},75);assert.equal(specs.length,3);assert.ok(specs[0].target<specs[1].target);for(const s of specs)assert.deepEqual(s.waypoints[0],s.waypoints.at(-1));});
test('map geometry projects all real routes within the viewport',()=>{const layout=L.mapLayout([route()]);assert.ok(layout.tiles.length>0);assert.ok(layout.start.every(Number.isFinite));assert.match(layout.paths[0].d,/^M/);});
test('malformed geometry and disconnected return routes are rejected',()=>{assert.throws(()=>L.normalizeRoute({features:[]},spec));assert.throws(()=>L.normalizeRoute({features:[{geometry:{type:'LineString',coordinates:[[0,0],[0,.1],[0,.2]]},properties:{'track-length':'10000'}}]},spec));});
test('HTTP errors reject rather than falling back to invented weather',async()=>{const old=globalThis.fetch;globalThis.fetch=async()=>({ok:false,status:503});try{await assert.rejects(L.request('https://example.invalid/weather',0,50),/HTTP 503/);}finally{globalThis.fetch=old;}});

test('rain shower codes are not classified as snow',()=>{assert.notEqual(assess({weather_code:80,precipitation:.2}).status,'bad');});
test('daylight calculation uses sunrise rather than the previous whole hour',()=>{const w=weather();w.hourly.is_day.fill(0);assert.equal(L.forecastWindow(w,Date.UTC(2026,10,18,7,30),Date.UTC(2026,10,18,8)).night,false);});
