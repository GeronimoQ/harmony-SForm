/**
 * 对请求方法的封装
 * 仅有GET  /  POST
 */

import {httpReq} from '../util/request.js'

const connectTimeout = 60000
const readTimeout = 60000
const header = {
    'Content-Type': 'application/json'
}

function get(options, params) {
    let paramStr = ""
    for(let key in params) {
        let param = key + "=" + params[key] + "&"
        paramStr+=param
    }
    //    去除最后一个&
    let url1=options.url+"?"+paramStr
    let url=url1.substring(0,url1.length-1)
    return httpReq.requestMethod(url,
        {
            method: "GET",
            connectTimeout: connectTimeout,
            readTimeout: readTimeout,
            header: header
        }
    )
}


function post(options, content) {
    return httpReq.requestMethod(options.url, {
        method: "POST",
        extraData: content,
        connectTimeout: connectTimeout,
        readTimeout: readTimeout,
        header: header
    })
}

function put(options, content) {
    return httpReq.requestMethod(options.url, {
        method: "PUT",
        extraData: content,
        connectTimeout: connectTimeout,
        readTimeout: readTimeout,
        header: header
    })
}


export {
    post,get,put
}