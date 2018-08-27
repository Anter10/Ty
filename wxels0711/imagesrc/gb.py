import PIL.Image

gbimg = PIL.Image.open('gb.bmp')

def getHZGrid(index):
    x, y = index % 70, index / 70
    for i in xrange(11):
        ss = ''
        for j in xrange(11):
            c = gbimg.getpixel((x*13+j, y*13+i)) / 255
            ss+=(' ' if c==0 else '@')
        print ss
            

for x in xrange(6763):
    getHZGrid(x)

#getHZGrid(662)
