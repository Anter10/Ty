import os, json
resmap = {}
resmap['a23235d1-15db-4b95-8439-a2e005bfff91'] = ['null-default_sprite_splash', '']
resmap['8cdb44ac-a3f6-449f-b354-7cd48cf84061'] = ['null-default_sprite','']
fires = ['assets/game.fire']

nulls = {}
packs = {}
imgs =  {}

SF = '_spriteFrame'
AL = '_atlas'
CO = '_components'
SM = 'subMetas'

for dp, dn, fn in os.walk('assets'):
    for f in fn:
        path = os.path.join(dp, f)
        if f.endswith('.meta'):
            j = json.loads(open(path).read())
            if SM in j:
                for sf in j[SM]:
                    sfo = j[SM][sf]
                    resmap[sfo['uuid']] = [path, sf]
            resmap[j['uuid']] = [path, '']
        if f.endswith('.prefab'):
            fires.append(path)

def getPath(o):
    if AL in o and SF in o: 
        a, s = o[AL], o[SF]
        aid, sid = 'null-atlas', ['null-spriteframe', '']
        if a != None:
            aid = a['__uuid__']
            aid = resmap.get(aid, aid)
        if s != None:
            sid = s['__uuid__']
            if sid not in resmap:
                return ['null-'+sid, 'NOT-IN-RESMAP']
            else:
                sid = resmap.get(sid, sid)
        return sid
    else:
        return ['EEE', 'EEE']

def proc(f, j):
    print f
    for o in j:
        if o['__type__'] == 'cc.Node':
            n = o['_name']
            if CO in o:
                coms = o[CO]
                if len(coms)!=0:
                    for c in coms:
                        idx = c['__id__']
                        if j[idx]['__type__'] == 'cc.Sprite':
                            p, s = getPath(j[idx])
                            s1 = p[7:-5]
                            if p.find('null-')!=-1:
                                nulls[s1]=1
                            else:
                                if s1.endswith('.plist'):
                                    print '\tP', n, s1, s
                                    if s1 not in packs: packs[s1] = []
                                    packs[s1].append([s,n])
                                else:
                                    print '\tI', n, s1
                                    if s1 not in imgs: imgs[s1]=[]
                                    imgs[s1].append([s,n])

for f in fires:
    j = json.loads(open(f).read())
    proc(f, j)

#for p in packs:
#    print 'PACK', p

#for p in imgs:
#    print 'cp assets/'+p+' /tmp/imgs'


