import {get,post} from './methond.js'

const table='/platTaskTest'

const APIS={
    taskInfoByIdAPI:{
        method:'GET',
        url:table+"/queryById"
    }
}

const getTaskInfoById=params=>get(APIS.taskInfoByIdAPI,params)

const taskAPI={
    getTaskInfoById
}


export default taskAPI;