import {get,post} from './methond.js'

const table='/platFormmodelTest'

const APIS={
    modelByIdAPI:{
        method:'GET',
        url:table+'/queryById'
    }
}

const getFormModelById=modelId=>get(APIS.modelByIdAPI,modelId)


const modelAPI={
    getFormModelById
}

export default modelAPI