
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
//queryHistoryByUId
const getHistoryAPI = {
    url: table + '/queryHistoryByUId',
    method: 'GET',
    param:{
        id:'userId'
    }
}
//queryByUIdAndTId
const getFilledDataAPI = {
    url: table + '/queryByUIdAndTId',
    method: 'GET',
    param:{
        userId:"",
        taskId:""
    }
}


const submitFillData=fillDataList=>post(APIS.add,fillDataList)
const getFillHistory=id=>get(getHistoryAPI,id)
const getFilledData=params=>get(getFilledDataAPI,params)
export {submitFillData,getFillHistory,getFilledData}