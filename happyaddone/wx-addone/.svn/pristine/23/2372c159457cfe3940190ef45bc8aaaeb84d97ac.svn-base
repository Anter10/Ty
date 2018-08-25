#!/usr/bin/env python
# -*- coding: UTF-8 -*-
'''
这个脚本还不通用
'''
import os, sys
from PIL import Image

def getNameList(dir,wildcard,recursion,array):
    '''
    获取当前目录及其子目录中所有指定类型文件的绝对路径
    :param dir:
    :param wildcard:
    :param recursion:
    :param array:
    :return:
    '''
    exts = wildcard.split(" ")
    files = os.listdir(dir)
    for name in files:
        fullname = os.path.join(dir,name)
        if os.path.isdir(fullname) & recursion:
            getNameList(fullname,wildcard,recursion,array)
        else:
            for ext in exts:
                if(name.endswith(ext)):
                    array.append(fullname)
                    break

def run():
    print('run')
    arr_png_path = []
    root_path = '/Users/tuyoo/Desktop/svn_code/wx-els/branch/branch-prop-20180711/tools/autoscale/skins'
    save_path = '/Users/tuyoo/Desktop/svn_code/wx-els/branch/branch-prop-20180711/tools/autoscale/skins-sacle'
    getNameList(root_path, '.png', 1, arr_png_path)
    print(arr_png_path)
    idx = 0
    type_idx = 0
    for path in arr_png_path:
        img = Image.open(path)
        t_idx = path.split('blk')[1].split('.')[0]
        name = 'b_%d_%s.png'%(type_idx,t_idx)
        img.resize((72,72),Image.ANTIALIAS).save(save_path+'/'+name)
        if idx == 11:
            idx = 0
            type_idx = type_idx + 1
        else:
            idx = idx + 1

if __name__ == '__main__':
    run()