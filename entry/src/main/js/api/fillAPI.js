
import {get,post} from './methond.js'
const table = "/platFillTest"
//const list = {
//    url: table + '/list',
//    method: 'GET'
//}

const APIS={
    add:{
        url: table + '/add',
        method: 'POST',
        params:{
            "fillDate": "",
            "formData": "",
            "id": "",
            "taskId": "",
            "userId": ""
        }
    }
}



const submitFillData=fillDataList=>post(APIS.add,fillDataList)


export {submitFillData}