import {groupOption} from '../../../api/userAPI.js';
import {deepClone} from '../../../util/util.js';
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
        refresh: false,
        javaInterface: null,
        userInfo: {
            group: {
                id: '123abcd',
                groupName: 'BLUE WORLD',
                groupInstr: 'BLUE WORLD',
                owner: '123'
            },
            id: "123abcd",
            joined: false,
            userId: "1234",
            userName: "Geronimo",
        },
        joined:false,
        groupTaskList: [{
                            taskInfo: '',
                            isNew: false
                        }],
        taskListIndexMap: {}
    },

    onShow() {
        this.getUserInfo();
        // @ts-ignore
        this.javaInterface = createLocalParticleAbility('com.example.learnmyapplication_ark.QrScanningServiceAbility');
    },

    jumpToLoginPage() {
        router.push({
            uri: "pages/index/index"
        })
    },
    //        菜单点击事件
    menuSkip(name, menuId) {
        switch (menuId) {
//            修改密码
            case 0:{
                router.push({
                    uri:"pages/userOpPage/userOpPage",
                    params: {
                        userInfo:this.userInfo,
                        opType:"changePwd"
                    }
                })
                break;
            }
        //            退团
            case 1:
            {
                this.groupOP(3)
                break;
            }
        //                入团
            case 2:
            {
                this.groupOP(2)
                break;
            }
//           填报历史
            case 3:{
                router.push({
                    uri:"pages/taskList/taskList",
                    params: {
                        userInfo:this.userInfo,
                        taskType:"history",
                        designer:this.designer
                    }
                })
            }
        }
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

    async logout() {
        let context = featureAbility.getContext()
        let path = await context.getFilesDir()

        let storagePath = path + "/userInfo"

        prompt.showDialog({
            message: "是否退出登录?",
            title: "退出登录",
            buttons: [
                {
                    text: '确定退出',
                    color: '#666666',
                },
            ],
            success: async function (data) {
                await dataStorage.deleteStorage(storagePath).then(() => {
                    console.info("Deleted successfully.")
                    router.push({
                        uri: "pages/index/index"
                    })
                }).catch((err) => {
                    console.info("Deleted failed with err: " + err)
                })
                console.log('dialog success callback，click button : ' + data.index);
            },
            cancel: function () {
                console.log('dialog cancel callback');
            },
        })


    },


    async getUserInfo() {
        let context = featureAbility.getContext()
        let path = await context.getFilesDir()
        let isLogin = false;
        let storagePath = path + "/userInfo"
        let storage = null;

        await dataStorage.getStorage(storagePath).then(data => {
            storage = data;
        }).catch(error => {
            console.error("获取用户数据失败--------" + error)
        })

        if (storage !== null) {
            console.info("开始获取UserInfo")

            await storage.get("userInfo", "default").then(userInfo => {

                if (userInfo === "default") {
                    //                    未登录
                    prompt.showToast({
                        message: "请先登录!"
                    });
                    setTimeout(_ => {
                        router.push({
                            uri: "pages/index/index"
                        })
                    }, 1000);
                } else {
                    this.userInfo = JSON.parse(userInfo);
                    isLogin = true;
                    console.info("获取用户数据成功");
                }

            }).catch(error => {
                console.error("用户信息读取失败" + error);
            })
        }
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
                designer: this.designer,
                userInfo:this.userInfo
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
    async modelRequestSuccess(modelInfo) {
        console.info(JSON.stringify(modelInfo))
        this.designer.modelInfo = JSON.parse(modelInfo.result)
    },


    async groupOP(type) {
        var that=this
        let params = {
            groupId: that.userInfo.group.id,
            id: that.userInfo.id,
            joined: true,
            //0：踢出 1：邀请；2：接受,3:退出
            opType: type,
            userId: that.userInfo.userId,
            userName: ""
        }
        prompt.showDialog({
            message: "确定退出/加入该团体",
            title: that.userInfo.group.groupName,
            buttons: [
                {
                    text: '确定',
                    color: '#666666',
                },
            ],
            success: async function (data) {
                await groupOption(params).then(res => {
                    let joined=!that.userInfo.joined;
                    that.userInfo.joined =joined ;
                }).catch()
                console.log('dialog success callback，click button : ' + data.index);
            },
            cancel: function () {
                console.log('dialog cancel callback');
            },
        })

    },
}
