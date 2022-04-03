import {getFillHistory, getFilledData} from '../../../api/fillAPI.js';
import router from '@system.router';
import modelAPI from '../../../api/modelAPI.js';
import prompt from '@system.prompt';
import {deepClone} from '../../../util/util.js';
import taskAPI from '../../../api/taskAPI.js';

export default {
    props: {
        //        1,团体
        taskType: {
            default: "group"
        },
        userInfo: {
            default: null
        },
        designer: {
            default: null
        }
    },
    data: {
        refresh: false,
        groupTaskList: [
            //            {
            //                taskInfo: {
            //                    id: '1508825265501716481',
            //                    userId: '1508795296627433473',
            //                    createTime: '2022-03-29 15:11:36',
            //                    title: '团体任务测试1',
            //                    instr: '团体任务测试',
            //                    modelId: '1508798142160707585',
            //                    disabled: true
            //                },
            //                isNew: true
            //            }
        ],
        taskIdMap: new Map(),
        oldGroupTaskList:[]
    },


    async refreshOp(e) {

        var that = this;
        that.refresh = e.refreshing;
        that.oldGroupTaskList=await deepClone(that.groupTaskList)
        setTimeout(function () {
            that.refresh = false;
            //            that.list.unshift(addItem);
            console.info("tasklist type" + that.taskType)
            switch (that.taskType) {
                case "group":
                {
                    that.getGroupTasks()
                    break;
                }
                case "history":
                {
                    that.getHistoryFillTask()
                    break;
                }
            }
            //            prompt.showToast({
            //                message: '刷新完成!'
            //            })
        }, 2000)

    },


    async getHistoryFillTask() {
        var that = this;
        let params = {
            id: this.userInfo.id
        }
        var idMap=[];
        var oldList=that.oldGroupTaskList
        for (var index = 0; index < oldList.length; index++) {
            let id=oldList[index].taskInfo.id
            console.info("oldList[index]:"+oldList[index]+"~~~~~~~~id:"+id)
            idMap.push(id)
        }

        that.groupTaskList = []
        await getFillHistory(params).then(res => {
            let taskList = res.result;
            for (let index in taskList) {
                let task = deepClone(taskList[index])
                let item = {
                    taskInfo: task,
                    isNew: false,
                }
                if(idMap.indexOf(task.id)===-1){
                    item.isNew=true
                    that.groupTaskList.unshift(item);
                }else{
                    that.groupTaskList.push(item)
                }
            }
        }).catch()
    },
    /**
     * 获取任务的列表
     */
    async getGroupTasks() {
        var that = this
        //        先清空
        let pramas = {
            groupId: this.userInfo.group.id
        }
        var idMap=[];
        var oldList=that.oldGroupTaskList
        for (var index = 0; index < oldList.length; index++) {
            let id=oldList[index].taskInfo.id
            console.info("oldList[index]:"+oldList[index]+"~~~~~~~~id:"+id)
            idMap.push(id)
        }
        that.groupTaskList = []
        //
        await taskAPI.getGroupTaskList(pramas).then(res => {
            let taskList = res.result;
            for (let index in taskList) {
                let task = deepClone(taskList[index])
                let item = {
                    taskInfo: task,
                    isNew: false
                }
                if(idMap.indexOf(task.id)===-1){
                    item.isNew=true
                    that.groupTaskList.unshift(item);
                }else{
                    that.groupTaskList.push(item)
                }

            }
        }).catch(error => {
            console.error("获取团体任务列表失败" + error)
        })

    },


    async jumpToDesigner(taskInfo) {
        switch (this.taskType) {
            case "group":
            {
                this.designer.taskInfo = taskInfo
                router.push({
                    uri: "pages/formDesigner/formDesigner",
                    params: {
                        designer: this.designer,
                        userInfo: this.userInfo
                    }
                })
                break;
            }
            case "history":
            {
                //                获取fill
                let params = {
                    userId: this.userInfo.id,
                    taskId: taskInfo.id
                }
                await getFilledData(params).then(res => {
                    let filledInfo = res.result
                    let modelInfo = JSON.parse(filledInfo.formData);
                    console.info("!!!!!!!!!!!" + JSON.stringify(modelInfo))
                    this.modelRequestSuccess(modelInfo)
                }).catch()

                break;
            }
        }
    },

    async modelRequestSuccess(modelInfo) {
        let fillDataList = []
        let widgetLiST = []
        for (var index in modelInfo) {
            let fillData = modelInfo[index]
            widgetLiST.push(fillData.widgetCopy);
            fillDataList.push(fillData.value)
        }
        console.info(JSON.stringify(modelInfo))
        this.designer.filledDataList = await deepClone(fillDataList)
        this.designer.modelInfo.itemList = await deepClone(widgetLiST)

        router.push({
            uri: "pages/formDesigner/formDesigner",
            params: {
                designer: this.designer,
                readOnly: true,
            }
        })
        console.info("!!!!!!!!!" + JSON.stringify(this.designer.filledDataList))
        //        console.info("!!!!!!!!!"+JSON.stringify(this.designer.modelInfo.itemList))
    },
}
