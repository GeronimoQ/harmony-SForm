import modelAPI from '../../../api/modelAPI.js';
import createDesigner from '../formDesigner/common/designer.js';
import taskAPI from '../../../api/taskAPI.js';
import menuData from '../../common/data/menuData.js'
import prompt from '@system.prompt';
import router from '@system.router';
import wantConstant from '@ohos.ability.wantConstant';
import featureAbility from '@ohos.ability.featureAbility';
import dataStorage from '@ohos.data.storage'

export default {
    data: {
        listMenu: menuData, // 菜单数据
        designer: createDesigner(this),
        javaInterface: null
    },

    onShow() {
        // @ts-ignore
        this.javaInterface = createLocalParticleAbility('com.example.learnmyapplication_ark.QrScanningServiceAbility');
    },

    menuSkip(name) {
        prompt.showToast({
            message: name,
        });
    },
    showTaskInfoPanel() {
        router.push({
            uri: '../../../FComponent/pages/formDesigner/formDesigner.hml'
        })
    },

    makeAction(bundleName, abilityName, code, abilityType, data) {
        const action = {};
        action.bundleName = bundleName;
        action.abilityName = abilityName;
        action.messageCode = code;
        action.abilityType = abilityType;
        action.data = data;
        action.syncOption = 0;
        return action;
    },

    start_scanning() {
        this.javaInterface.startToScanning().then(data => {
            if (data != null && data !== 'fail') {
                this.requestTaskInfo(data)
            }
        }).catch(_ => {
        })
    },


    /**
 * async http request
 * 网络请求task和formModel数据
 */
    async requestTaskInfo(taskId) {
        let params = {
            id: taskId
        }
        console.info("params=" + JSON.stringify(params))
        let promise = taskAPI.getTaskInfoById(params)
        promise.then(data => {
            this.requestSuccess(data)
        }).catch(err => {
            console.error("!!!!!!!!!!!!!!!!!!!!reject!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        })
    },
    async requestSuccess(res) {
        this.designer.taskInfo = res.result
        router.push({
            uri: "pages/formDesigner/formDesigner",
            params: {
                designer: this.designer
            }
        })

    },
    async requestFormModel(modelId) {
        var params = {
            id: modelId
        }
        let promise = modelAPI.getFormModelById(params)
        promise.then(data => {
            this.modelRequestSuccess(data)
        }).catch(_ => {
        })
    },
    async modelRequestSuccess(modelInfo){
        console.info(JSON.stringify(modelInfo))
        this.designer.modelInfo = JSON.parse(modelInfo.result)
    }
}
