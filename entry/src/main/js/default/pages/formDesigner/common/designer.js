import {widgetListCase, widgetListCase2, widgetListCase3, widgetListCase4, widgetListCase5} from './testCase.js'


export default function createDesigner(pageInstance) {



    return {
        taskInfo: {
            "id": "123456789",
            "userId": "123456",
            "createTime": "2022-03-06 13:49:55",
            "title": "abc",
            "instr": "abc",
            "modelId": "987654321",
            "disabled": false
        },

        modelInfo: {
            itemList: widgetListCase4
        },

        fillData: [],
        indexMap: {},

        defaultStyle: {
            taskInfoHeadStyle: {}
        },

    }
}