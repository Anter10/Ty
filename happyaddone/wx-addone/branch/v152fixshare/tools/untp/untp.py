import os, sys
from xml.etree import ElementTree
from PIL import Image

def tree2dict(tree):
    ret ={}
    for idx, item in enumerate(tree):
        if item.tag == 'key':
            if tree[idx + 1].tag == 'string':
                ret[item.text] = tree[idx + 1].text
            elif tree[idx + 1].tag == 'true':
                ret[item.text] = True
            elif tree[idx + 1].tag == 'false':
                ret[item.text] = False
            elif tree[idx + 1].tag == 'dict':
                ret[item.text] = tree2dict(tree[idx + 1])
    return ret

def run(file_name):
    print('start run')
    f_plist = file_name + '.plist'
    f_png = file_name + '.png'
    file_path = f_plist.replace('.plist','')
    str_plist = open(f_plist,'r').read()
    root = ElementTree.fromstring(str_plist)
    dict = tree2dict(root[0])
    big_img = Image.open(f_png)

    to_list = lambda x: x.replace('{','').replace('}','').split(',')
    for k,v in dict['frames'].items():
        rect_list = to_list(v['frame'])
        width = int(rect_list[3] if v['rotated'] else rect_list[2])
        height = int(rect_list[2] if v['rotated'] else rect_list[3])
        box = (
               int(rect_list[0]),
               int(rect_list[1]),
               int(rect_list[0]) + width,
               int(rect_list[1]) + height
              )
        rect_on_big = big_img.crop(box)
        result_img = Image.new('RGBA',[width,height],(0,0,0,0))
        result_img.paste(rect_on_big, (0,0,width,height), mask=0)
        if(v['rotated']):
            result_img = result_img.transpose(Image.ROTATE_90)
        if not os.path.isdir(file_path):
            os.mkdir(file_path)
        outfile = (file_path + '/' + k)
        print(outfile, "generated")
        result_img.save(outfile)

if __name__ == '__main__':
    print(sys.argv)
    # 文件名，只要文件名，不要后缀，你懂的！
    file_name = sys.argv[1]
    #file_name = 'elst'
    run(file_name)