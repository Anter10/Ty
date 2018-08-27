bmpres = {}

for l in open('ai.txt', 'r'):
    l = l[:-1]
    p1 = l.find('aibmp')
    p2 = l.find('step')
    if p1!=-1 and p2!=-1:
        try:
            bmp, step = int(l[p1+6:p2]), int(l[p2+5:])
            if step<5:
                print l
            else:
                if bmp in bmpres:
                    bmpres[bmp].append(step)
                else:
                    bmpres[bmp]=[step]
        except:
            print l

bmpidx = []
for x in xrange(188):
    if x in bmpres:
        bmpidx.append([x, sum(bmpres[x])/len(bmpres[x])])

print sorted(bmpidx, key=lambda x:x[1])

print len(bmpidx)
