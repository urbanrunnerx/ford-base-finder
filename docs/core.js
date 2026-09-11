export const normalize=s=>String(s).toLowerCase().replace(/a\/c/g,'ac').replace(/[^a-z0-9]+/g,' ').trim();
const groups=[['HVAC',/ac |hvac|blower|heater|cabin|air conditioning/],['Brakes',/brake|abs |caliper/],['Fuel & air',/fuel|throttle|intake|airflow|air cleaner|engine air filter|vapor|carburetor/],['Transmission & driveline',/transmission|clutch|axle|differential|driveshaft|transfer case|flywheel|torque converter/],['Steering & suspension',/steering|suspension|spring|shock|control arm|stabilizer|sway bar|tie rod|ball joint|spindle|knuckle|pitman/],['Engine & cooling',/engine|crank|camshaft|oil |gasket|coolant|radiator|water pump|timing|piston|valve|serpentine|turbo|intercooler|exhaust|muffler|catalytic/],['Electrical',/sensor|switch|module|relay|battery|alternator|starter|ignition|lamp|bulb|electrical|wiring|airbag|clockspring/]];
export const category=name=>/reductant|urea/i.test(name)?'Engine & cooling':/\bwire\b|harness|inverter|charger|camera/i.test(name)?'Electrical':groups.find(([,re])=>re.test(name.toLowerCase()))?.[0]||'Body & interior';
const aliases={'19E616':'temperature actuator hot cold clicking dash blend motor','19805':'fan cabin fan heater fan no airflow','19N619':'pollen filter cabin filter ac filter','9601':'air cleaner element engine filter','12A650':'pcm ecm ecu engine computer brain','12B579':'maf air meter','12029':'cop coil pack spark ignition','9B989':'tps','14A664':'clock spring spiral cable','2C205':'abs speed pickup','6C640':'cac boost hose intercooler hose','6B209':'belt tensioner','3504':'steering rack rack pinion','9F836':'gas pedal accelerator pedal','15K601':'remote key clicker fob','9H307':'gas pump sending unit','6710':'sump gasket','6701':'rear main seal rms','19E624':'blower resistor fan control','3A130':'track rod tie rod end','3B676':'intermediate steering shaft','12A402':'spark plug boot','11002':'cranking motor','14S411':'wire wiring harness repair plug connector','9D650':'charcoal evap canister','8575':'coolant temperature thermostat'};
export function hydrate(r){const terms=/reductant|urea/i.test(r.name)?'def diesel exhaust fluid urea reductant':'';return {...r,category:r.category||category(r.name),text:normalize([r.name,r.description||'',r.aliases||'',aliases[r.base]||'',terms].join(' '))};}
export function decode(input,records=[]){
 const s=input.toUpperCase().trim().replace(/[–—]/g,'-');
 // Hyphenated conventional Ford and Ford Performance formats. Never infer fitment.
 let m=s.match(/^([A-Z0-9]{4}|M|CM)[ -]+([0-9][A-Z0-9]{3,6})[ -]+([A-Z0-9]{1,8})$/);
 if(m)return {prefix:m[1],base:m[2],suffix:m[3],kind:'formatted'};
 const compact=s.replace(/\s/g,'');
 if(records.some(r=>r.base===compact))return null;
 if(/^[A-Z0-9]{4}[0-9][A-Z0-9]{4,14}$/.test(compact)){
 const tail=compact.slice(4);const hits=[...new Set(records.map(r=>r.base))].filter(b=>tail.startsWith(b)&&/^[A-Z][A-Z0-9]{0,7}$/.test(tail.slice(b.length)));
 if(hits.length===1)return {prefix:compact.slice(0,4),base:hits[0],suffix:tail.slice(hits[0].length),kind:'inferred'};
 }
 return null;
}
function distance(a,b){let v=Array.from({length:b.length+1},(_,i)=>i);for(let i=0;i<a.length;i++){let w=[i+1];for(let j=0;j<b.length;j++)w.push(Math.min(w[j]+1,v[j+1]+1,v[j]+(a[i]!==b[j])));v=w;}return v[b.length];}
const stop=new Set('the a an for of part ford my on in with is that it need to assembly assy please find'.split(' '));
export function search(query,records,filter='All systems'){
 const q=normalize(query),code=query.toUpperCase().replace(/[^A-Z0-9]/g,''),parsed=decode(query,records);let tokens=q.split(' ').filter(t=>!stop.has(t));
 const expand={a:'ac',aircon:'ac',airconditioning:'ac',windscreen:'windshield',stabiliser:'stabilizer',tyre:'tire',bonnet:'hood',boot:'boot'}; tokens=tokens.map(t=>expand[t]||t);
 return records.filter(r=>filter==='All systems'||r.category===filter).map(r=>{
 let score=0,reason='Reference entry';
 if(!q)return {r,score,reason};
 if(r.base===code||r.base===parsed?.base){score=1000;reason=parsed?'Base extracted from part number':'Exact base number';}
 else if(/^[0-9][A-Z0-9]*$/.test(code)&&r.base.startsWith(code)){score=600;reason='Base number prefix';}
 else if(!parsed&&tokens.length){let words=r.text.split(' '),hits=0,fuzzy=false;for(const t of tokens){if(words.includes(t)) {score+=30;hits++;}else if(words.some(w=>w.startsWith(t)&&t.length>=3)){score+=20;hits++;}else if(t.length>=5&&words.some(w=>Math.abs(w.length-t.length)<=1&&distance(w,t)<=1)){score+=10;hits++;fuzzy=true;}}
 if(hits/tokens.length<0.65)score=0;else {const nameWords=normalize(r.name).split(' ');if(normalize(r.name).includes(q))score+=80;score+=tokens.filter(t=>nameWords.some(w=>w===t||(t.length>=3&&w.startsWith(t)))).length*15;score+=hits/tokens.length*30;score+=10/nameWords.filter(w=>!['hvac','assembly'].includes(w)).length;reason=fuzzy?'Similar wording':'Description match';}}
 return {r,score,reason};}).filter(x=>!q||x.score>0).sort((a,b)=>b.score-a.score||a.r.name.localeCompare(b.r.name));
}
export function parseCSV(text){const rows=[];let row=[],field='',quoted=false;const input=text.replace(/^\uFEFF/,'');for(let i=0;i<input.length;i++){const c=input[i];if(c==='"'){if(quoted&&input[i+1]==='"'){field+='"';i++;}else if(quoted||!field)quoted=!quoted;else throw Error('Unexpected quote in CSV.');}else if(c===','&&!quoted){row.push(field);field='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&input[i+1]==='\n')i++;row.push(field);if(row.some(x=>x.trim()))rows.push(row);row=[];field='';}else field+=c;}if(quoted)throw Error('Unclosed quote in CSV.');row.push(field);if(row.some(x=>x.trim()))rows.push(row);return rows;}
export function importRows(text){const rows=parseCSV(text);if(!rows.length)throw Error('The file is empty.');const h=rows.shift().map(s=>s.trim().toLowerCase());if(!h.includes('base')||!h.includes('name'))throw Error('CSV needs base and name column headers.');let errors=[];let records=[];rows.forEach((row,i)=>{const v=Object.fromEntries(h.map((k,j)=>[k,(row[j]||'').trim()]));const base=v.base.toUpperCase();if(!/^[0-9][A-Z0-9]{3,6}$/.test(base)||!v.name||v.name.length>200){errors.push(i+2);return;}if(v.source&&!/^https?:\/\//i.test(v.source)){errors.push(i+2);return;}records.push(hydrate({base,name:v.name,description:(v.description||'').slice(0,2000),aliases:(v.aliases||'').slice(0,2000),source:v.source,sourceName:'Your imported reference',status:'Imported — unverified'}));});if(errors.length)throw Error('Nothing imported. Check base, name or source on CSV rows '+errors.slice(0,10).join(', ')+'.');if(!records.length)throw Error('No part records found.');if(records.length>50000)throw Error('Limit each import to 50,000 rows.');return records;}
