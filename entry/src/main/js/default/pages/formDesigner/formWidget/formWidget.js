import modelAPI from '../../../../api/modelAPI.js';

export default {
    props: {
        designer: {
            default: null
        },
        designerConfig: {
            default: null
        },
        tempStorage:{
            default:null
        },
        readOnly:{
            default:false
        }
    },


    data: {
        parentEvent:""
    },

    getWidgetData(e) {
        //        可获取到组件的填报
        var fillData = e.detail.fillData
        var widgetCopy = fillData.widgetCopy
        //        this.fillData[this.indexMap.get(widgetCopy.id)].value = JSON.parse(JSON.stringify(fillData.value))
        console.info("@@@@@@@@@" + JSON.stringify(fillData))
        //        this.designer.setFillData(JSON.stringify(this.fillData))
    },


}
