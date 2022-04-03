/**
 * 这是对网络请求的封装
 */
import http from '@ohos.net.http';
import prompt from '@system.prompt';

const serverConfig = {
    baseUri: "http://192.168.43.73:8088/jeecg-boot/geronimo",
    connectTimeout: 20000,
    readTimeout: 60000,
    header: {
        'Content-Type': 'application/json'
    }
}

const request = {
    requestMethod,
}
//promise对responseCode的处理,只返回result!
function requestMethod(url, options) {
//    不能单例，必须每次请求都创建一个httprequest ----error------ "code":200,"data":"The request has been canceled."
    let httpRequest = http.createHttp()
    let promise = httpRequest.request(serverConfig.baseUri + url, options,).then(data => codeHandler(data),error => errorResponseCodeHandler(error))
    return promise
}


/**
 * responseCode==200时候，对code的处理
 */
function codeHandler(data) {
    let resStr=data.result
    resStr.replace(/\\"/g,'"').replace(/]"/g,"]").replace(/"\[/g,"[");
    let res=JSON.parse(resStr)
    console.info("------------rescode:200---------------:")
    if (res.code === 200 || res.code === 0) {
        console.info("------------code:200---------------")
        return Promise.resolve(res)
    } else {
        console.info("------------code:?00---------------")
        return errorCodeHandler(data)
    }
}

/**
 * 基于data.result.code
 * @param data
 */
function errorCodeHandler(data) {
    var res = JSON.parse(data.result)
    switch (res.code) {
        case 500:
        {
            //            服务器错误
            console.info("------------code:500---------------")
            prompt.showToast({ message: res.message })
            break;
        }
        case 510:
        {
            console.info("------------code:510---------------")
            //            访问权限未通过
            prompt.showToast({ message: res.message })
            break;
        }
        default:
            prompt.showToast({ message: res.message })
    }
    return Promise.reject(data)
}
/**
 * 当response!=200时候，对正常的相应码的回应
 * @param error
 */
function errorResponseCodeHandler(error) {
    console.info("------------rescode:?00---------------:" + JSON.stringify(error))
    switch (error.code) {
    // 401: 未登录
    // 未登录则跳转登录页面，并携带当前页面的路径
    // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
        // router.replace({
        //     path: '/login',
        //     query: {
        //         redirect: router.currentRoute.fullPath
        //     }
        // });
            break;
    // 403 token过期
    // 登录过期对用户进行提示
    // 清除本地token和清空vuex中token对象
    // 跳转登录页面
        case 403:
        // Toast({
        //     message: '登录过期，请重新登录',
        //     duration: 1000,
        //     forbidClick: true
        // });
        // // 清除token
        // localStorage.removeItem('token');
        // store.commit('loginSuccess', null);
        // // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
        // setTimeout(() => {
        //     router.replace({
        //         path: '/login',
        //         query: {
        //             redirect: router.currentRoute.fullPath
        //         }
        //     });
        // }, 1000);
            break;
    // 404请求不存在
        case 404:
            prompt.showToast({
                message: "请求不存在"
            });
            break;
    // 其他错误，直接抛出错误提示
        default:
            console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"+JSON.stringify(error))
            prompt.showToast({
                message: "网络错误"
            });
    }
    return Promise.reject(error.result);
}


export {request as httpReq}