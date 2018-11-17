var exec = require('child_process').exec;
let uglify = require('uglify-js');
let fs = require('fs');
let readline = require('readline');
module.exports = {
    load (){},
    unload(){},
    buildDebug(){
        let command = `/Applications/CocosCreator.app/Contents/MacOS/CocosCreator --path ${Editor.projectPath} --build "platform=wechatgame;debug=true"`;
        //let command = `sh ${build_sh}`;
        Editor.log('----------build debug---------');
        Editor.log(`run command===>${command}`);
        exec(command, function(err, stdout, stderr){
            if(err){
                Editor.log(err);
            }
            else{
                Editor.log(stdout);
                Editor.log('build debug end');
            }
        });
    },
    buildRelease(){
        //let build_sh = `${Editor.projectPath}/build-release.sh`;
        let command = `/Applications/CocosCreator.app/Contents/MacOS/CocosCreator --path ${Editor.projectPath} --build "platform=wechatgame;debug=false"`;
        Editor.log('----------build release---------');
        Editor.log(`run command===>${command}`);
        let self = this;
        exec(command, function(err, stdout, stderr){
            if(err){
                Editor.log(err);
            }
            else{
                Editor.log(stdout);
                self.confuse();
            }
        });
    },
    findFile(path, type, callback){
        let command = `find ${path} -name "${type}"`;
        exec(command, function(err, stdout, stderr){
            if(err) Editor.log(err);
            else{
                let files = stdout.split('\n');
                Editor.log(typeof stdout, files.length);
                callback && callback(path, files);
            }
        });
    },
    tinyPngByFilePath(root, file_paths){
        let self = this;
        file_paths.forEach((file_path)=>{
            //file_path = PATH.join(root, file_path);
            //Editor.log(file_path);
            let command = `${__dirname}/tinypng/pngquant  --ext .png --force 256 --speed 1 --quality=30-40 ${file_path}`;
            Editor.log(command);
            exec(command, function(err, stdout, stderr){
                if(err){
                    Editor.log(err);
                }
                else{
                    Editor.log(stdout);
                }
            });
        });
    },
    tinyPng(){
        this.findFile(`${Editor.projectPath}/build/wechatgame`, "*.png", this.tinyPngByFilePath);
    },
    confuse(){
        let file_name = `${Editor.projectPath}/build/wechatgame/src/project.js`;
        let fread = fs.createReadStream(file_name);
        let obj_readline = readline.createInterface({
            input:fread
        });
        let code = '';
        let self = this;

        obj_readline.on('line', function(line){
            code += line;
            Editor.log('read code:', line);
        });
        obj_readline.on('close', function(){
            let result = uglify.minify(code);
            //Editor.log('read code:', result.code);

            fs.writeFile(file_name, result.code, function(err){
                if(err){
                    Editor.log('error',err);
                }
                Editor.log('confuse code end');
                self.tinyPng();
            });
        });
    },
    messages:{
        'build-debug'(){
            this.buildDebug();
        },
        'build-release'(){
            this.buildRelease();
        }
    }
};
