import {get,post} from './methond.js'

const table='/platTaskTest'

const APIS={
    taskInfoByIdAPI:{
        method:'GET',
        url:table+"/queryById"
    }
}

const getGroupTaskListAPI = {
    url: table + '/getGroupTaskList',
    method: 'GET',
    param:{
        groupId:''
    }
}


const getTaskInfoById=params=>get(APIS.taskInfoByIdAPI,params)
const getGroupTaskList=groupId=>get(getGroupTaskListAPI,groupId)

const taskAPI={
    getTaskInfoById,
    getGroupTaskList
}



export default taskAPI;