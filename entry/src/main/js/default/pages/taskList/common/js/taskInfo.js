import taskAPI from '../../../../../api/taskAPI.js';
import { deepClone } from '../../../../../util/util.js';

export default  function taskList(){

    return {
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

        /**
     * 获取任务的列表
     */
        async getGroupTasks() {
            var that = this
            //        先清空
            let pramas = {
                groupId: this.userInfo.group.id
            }
            //
            await taskAPI.getGroupTaskList(pramas).then(res => {
                let taskList = res.result;

                for (let index in taskList) {
                    let task = deepClone(taskList[index])
                    let item = {
                        taskInfo: task,
                        isNew: false
                    }

                    console.error("是否是新的任务" + !this.taskIdMap.has(task.id))
                    //                if(!idMap.has(task.id)){
                    //                    AidMap.set(task.id,"213")
                    //                    item.isNew=true;
                    //                    that.groupTaskList.unshift(item);
                    //                }

                }
            }).catch(error => {
                console.error("获取团体任务列表失败" + error)
            })

        }
    };

}