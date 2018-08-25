import os, sys
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
    name_png = []
    name_meta = []

if __name__ == '__main__':
    run()
