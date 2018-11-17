/**
 * Created by xiaochuntian on 2018/5/2.
 */

ty.HttpUtil = {
    httpPost:function (cfgObj,success, fail) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", cfgObj.url);

        if(cfgObj.headers) {
            for (let k in cfgObj.headers) {
                xhr.setRequestHeader(k.toString(), cfgObj.headers[k]);
                if ((k == 'content-type' || k == 'Content-type') && cfgObj.headers[k] == 'application/json;charset=UTF-8') {
                    useJson = true;
                }
            }
        }

        if(typeof(cfgObj.headers) != 'object') {
            cfgObj.headers = {
                'content-type': 'application/x-www-form-urlencoded;charset:UTF-8'
            };
        }
        
        let format_data = new FormData();
        for(let key in cfgObj.data){
            format_data.append(key.toString(), cfgObj.data[key]);
        }
        xhr.send(format_data);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status >= 200) {
                var response = xhr.responseText;
                if(typeof response === 'string'){
                    success && success(JSON.parse(response));
                }
                else{
                    fail && fail();
                }
            }
        };
    },

    httpGet:function (cfgObj, successcb, failcb) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", cfgObj.url);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status >= 200) {
                var response = xhr.responseText;
                if(typeof response === 'string'){
                    successcb && successcb(JSON.stringify(response));
                }
                else{
                    failcb && failcb();
                }
            }

        };
    }
};