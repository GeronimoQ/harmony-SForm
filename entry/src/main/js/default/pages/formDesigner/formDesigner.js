import createDesigner from './common/designer.js';
import modelAPI from '../../../api/modelAPI.js'
import router from '@system.router';
import http from '@ohos.net.http';
/**
 * 组件任务：
 * 1.分发各个widget的配置。
 * 2.收集子组件的配置以及VALUE，widgetConfig需要单独保留，以数据冗余。
 *
 */
export default {
    data: {
        designer: createDesigner(this),
        //        taskId是通过路由传过来的！请在在 qrScanning时候做数据处理！
        visible: {
            taskInfoPanelVb: false,
            submitSureBtnDS: false,
            loadImageVB: true,
        },
        model: {
            panelModelFlag: 'half'
        },
        style:{
          sureBtnText_bgc:'rgb(238, 132, 67)'
        },
        submitMessage: '填报数据分析中...'
    },

    //    初始化任务，通过路由传过来的taskId,将网络请求taskInfo,将其注册到designer中
    onShow() {
        if (this.designer) {
            this.visible.taskInfoPanelVb = true
            this.$element('taskInfoPanel').show()
            this.requestModelInfo()
        } else {
            router.back();
        }
    },

    async requestModelInfo() {
        var params = {
            id: this.designer.taskInfo.modelId
        }
        await modelAPI.getFormModelById(params).then(data => {
            let modelInfo = data.result
            modelInfo.itemList = JSON.parse(modelInfo.itemList)
            modelInfo.formConfig = JSON.parse(modelInfo.formConfig)
            this.designer.modelInfo = modelInfo
            //            表单填表初始化
            this.initFillDataArray(modelInfo)

        }).catch(_ => {
            console.error("!!!!!!!!!!!!!!!reject!!!!!!!!!!!!!!!!!!!!")
        })
    },


    initFillDataArray(modelInfo) {
        //        注意引用类型的拷贝
        let widgetList = modelInfo.itemList
        let indexMap = new Map()
        let fillData = new Array()
        for (let widget in widgetList) {
            var ori = {
                value: null,
                widgetCopy: widgetList[widget]
            }
            indexMap.set(widgetList[widget].id, widget)
            fillData.push(ori)
        }
        this.designer.fillData = fillData
        this.designer.indexMap = indexMap
    },

    checkFillDataBeforeSubmit() {
        let fillDataList = this.designer.fillData

        for (let fillD in fillDataList) {
            if (!fillDataList[fillD].value) {
                let label = fillDataList[fillD].widgetCopy.options.label
                setTimeout(this.checkFail(label), 2000);
                return
            }
        }
        setTimeout(this.checkSuccess(), 2000);


    },

    checkSuccess() {
        this.visible.loadImageVB=false
        this.visible.submitSureBtnDS = true
        this.submitMessage="填报有效，请提交"
        this.style.sureBtnText_bgc=''
    },
    checkFail(label){
        this.submitMessage = label + "项没有填写\r\n请填写后再提交"
    },

    submitFillData() {
        this.$element('sureDialog').show()
        this.checkFillDataBeforeSubmit()
    },

    sureSubmit_btn() {

    },
    cancelSubmit_btn() {
        this.$element("sureDialog").close()
    }
}
