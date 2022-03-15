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
        },
        model: {
            panelModelFlag: 'half'
        },
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
            let modelInfo=data.result
            modelInfo.itemList=JSON.parse(modelInfo.itemList)
            modelInfo.formConfig=JSON.parse(modelInfo.formConfig)
            this.designer.modelInfo = modelInfo
        }).catch(_ => {
            console.error("!!!!!!!!!!!!!!!reject!!!!!!!!!!!!!!!!!!!!")
        })
    }
}
