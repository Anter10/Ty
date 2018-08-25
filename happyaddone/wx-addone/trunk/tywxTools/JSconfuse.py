# -*- coding:utf-8 -*-

import os, shutil, re, commands, json

PROJ_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__),'..'))
OUTPUT_PATH = os.path.join(PROJ_PATH, 'tywxTools', 'confused')


def confuse():
    destJS = os.path.join(PROJ_PATH, 'build', 'wechatgame', 'src', 'project.js')
    JSName = 'project.js'
    if not os.path.isfile(destJS):
        destJS = os.path.join(PROJ_PATH, 'build', 'wechatgame', 'src', 'project.dev.js')
        JSName = 'project.dev.js'
    if os.path.isdir(OUTPUT_PATH):
        shutil.rmtree(OUTPUT_PATH)
    os.mkdir(OUTPUT_PATH)

    #备份一下
    shutil.copy(destJS, OUTPUT_PATH)

    jsList = []
    with open(destJS, 'r') as f:
        srclines = f.readlines()
        dstlines = []

    for l in srclines:
        if len(l) <= 1:
            continue
        dstlines.append(l)

    print json.dumps(jsList, indent=4)

    with open(os.path.join(OUTPUT_PATH, JSName), 'w') as f:
        f.writelines(dstlines)


    shcmd = os.path.join(PROJ_PATH, 'tywxTools', 'uglifyJS', 'bin', 'uglifyJS')
    shcmd += ' -c -mt --no-dead-code -nc --overwrite --reserved-names \"main\" '
    shcmd += os.path.join(OUTPUT_PATH, JSName)
    result = commands.getstatusoutput(shcmd)
    if result[0] != 0:
        raise Exception(result[1])
    else:
        shutil.copyfile(os.path.join(OUTPUT_PATH, JSName), destJS)
        print destJS + ' confuse success'


if __name__ == '__main__':
    confuse()
