"""Build searchable references from observed EPC table cells; no network or credentials."""
import json,re
from pathlib import Path
from collections import OrderedDict
ROOT=Path(__file__).resolve().parents[1]
groups=OrderedDict()
for p in sorted(ROOT.glob('epc*observations.json')):
    data=json.loads(p.read_text())
    for raw,base,location in data['rows']:
        assert re.fullmatch(r'[0-9][A-Z0-9]{3,6}',base), (p,base)
        family=re.sub(r'\s+',' ',raw.split('\n')[0]).strip(' -')
        key=(data['catalog'],base,family.lower())
        g=groups.setdefault(key,{'base':base,'family':family,'catalog':data['catalog'],'checkedAt':data['checkedAt'],'locations':[],'notes':[]})
        if location not in g['locations']: g['locations'].append(location)
        note=re.sub(r'\s+',' ',raw).strip()
        if note not in g['notes']: g['notes'].append(note)
entries=[]
for g in groups.values():
    sections=list(dict.fromkeys(re.sub(r'^\S+ - ','',loc).split(',')[0].split(';')[0] for loc in g['locations']))
    name=g.pop('family'); normalized=re.sub(r'[^a-z ]','',name.lower()).strip()
    if normalized in {'module','electronic module','pump assy','actuator assy','seal','gasket','switch assy','valve assy','clip','cover','plate','bracket'}:
        name+=' — '+sections[0]
    g['name']=name
    g['location']='; '.join(g['locations'][:4])
    if len(g['locations'])>4: g['location']+=f"; plus {len(g['locations'])-4} other observed locations."
    g['description']='Catalog terminology and listed location. This is a reference snapshot, not a VIN fitment or interchange confirmation.'
    g['aliases']=' '.join(sections)+' '+ ' '.join(n for n in g['notes'] if len(n)<220)
    # Avoid treating application/color/service notes as a universal product description.
    entries.append(g)
data={'checkedAt':'2026-09-10','source':'https://snaponepc.com/epc/#/','coverage':'Selected displayed EPC search results. Catalogs and locations are preserved on each entry. This is not a complete catalog export; no VIN filters were applied.','catalogs':list(dict.fromkeys(e['catalog'] for e in entries)),'entries':entries}
(ROOT/'dist/epc-reference.json').write_text(json.dumps(data,indent=2)+'\n')
old={line.split('|')[1] for line in (ROOT/'dist/reference.txt').read_text().splitlines()}|{'6731','8501'}
new={e['base'] for e in entries}
print(json.dumps({'epc_entries':len(entries),'epc_distinct_bases':len(new),'new_distinct_bases':len(new-old),'total_distinct_bases':len(old|new),'catalogs':len(data['catalogs'])}))
