import {generateUUID} from '../../../../util/util.js';
import dataStorage from '@ohos.data.storage';
import featureAbility from '@ohos.ability.featureAbility';
import prompt from '@system.prompt';


//TODO 若相同的表项填写的是不同的值，会取最后一次发生改变的表项值

export default function tempStorage(pageInstance) {


    const STORAGE_LABEL_PATH = "/label2Vk";
    const STORAGE_VK2V = "/Vk2V";
    const STORAGE_V2VK = "/V2Vk";


    var usable = true


    return {

        widgetList:[],

        storages: {
            labelStorage: null,
            Vk2VStorage: null,
            V2VkStorage: null,
        },


        /**
         * 获取storage对象
         */
        async initStorage() {
            var context = featureAbility.getContext()
            var path = await context.getFilesDir()
            let path1 = path + STORAGE_LABEL_PATH;
            let path2 = path + STORAGE_VK2V;
            let path3 = path + STORAGE_V2VK;
            //        初始化Storage对象
            dataStorage.getStorage(path1)
                .then(data => {
                    this.storages.labelStorage=data
                    console.warn(JSON.stringify(this.storages.labelStorage))
                }).catch(error => this.initError(error))
            dataStorage.getStorage(path2).then(data => {
                this.storages.Vk2VStorage = data;
            }).catch(error => this.initError(error))
            dataStorage.getStorage(path3).then(data => {
                this.storages.V2VkStorage = data
            }).catch(error => this.initError(error))
        },

        /**
 * 初始化的异常处理
 * @param error
 */
        initError(error) {
            prompt.showToast({
                message: "历史表项数据读取失败"
            })
            usable = false;
            console.error(JSON.stringify(error))
        },


        /**
 * 检查表项是否存在于填报历史数据中，若存在初始化后准备更新，若不存在，注册后再初始化（V2Ck唯一化）再准备更新
 * @param label
 */
        async checkLabel(label) {
            let vk =await this.selectVk(label);
            console.info("@@@@@@@@vk"+vk)
            let Vk2V = {
                Vk: "",
                value: ""
            }
            let l2Vk={
                label:label,
                Vk:""
            }
            if (!vk) {
                //                该label不存在，注册到storages中！
                //                新建VK UUID
                let VkUUID =await generateUUID(12)
                Vk2V.Vk = VkUUID
                l2Vk.Vk=VkUUID
                console.info("@@@@@@@@new vk"+VkUUID)
                //                注册
                await this.register(label, Vk2V)
                this.widgetList.push(l2Vk)
                console.info("@@@@@@@@@@new item"+JSON.stringify(this.widgetList))
            } else {
                //                存在---》1.改变V2vk的key,2.返回value
                let loadValue = await this.selectValue(vk)
                Vk2V.value = loadValue
                Vk2V.Vk=vk
                l2Vk.Vk=vk
                await this.startToUpdate(Vk2V)
                this.widgetList.push(l2Vk)
                console.info("@@@@@@@@@@old value"+loadValue)
                console.info("@@@@@@@@@@old item"+JSON.stringify(this.widgetList))
            }
            console.info("@@@@@@@@@@vk2v:"+JSON.stringify(Vk2V)+"  type  "+typeof Vk2V)
            return Vk2V
        },

        /**
 * 为没有存在过的label注册
 * @param label
 * @param Vk2V
 */
        async register(label, Vk2V) {
            console.info("@@@@@@@@@@注册新表项")
            //                注册到labelStorage中
            this.addLabel(label, Vk2V.Vk)
            //                注册到VK2V中
            this.addVk2V(Vk2V.Vk, Vk2V.value)
            //           以准备更新值的状态注册
            this.uniqueV2Vk(Vk2V, false)
        },

        /**
         * 对V2Vk进行唯一化，等待最后提交时候，查看是否有相同的值，决定保留还是删除
         * @param Vk2V
         * @param isExist
         */
        async uniqueV2Vk(Vk2V, isExist) {
            console.info("@@@@@@@@@@唯一化V2VK")
            if (!isExist) {
                //                如果不存在，则直接注册
//                在V2VK中如果KEY=VALUE说明该记录为新的记录，若找到了旧纪录可以索引，则删除该类型的记录
                this.addV2Vk(Vk2V.Vk, Vk2V.Vk)
            } else {
                //                如果存在，先删除原来的，再添加value唯一化的新记录
                //                    先检查是否由于重名表项，导致已经唯一化
                if (!this.hasV2Vk(Vk2V.Vk)) {
                    //                    如果没有唯一化
//                     将V2Vk键和值调换，保存旧值！
                    this.deleteV2Vk(Vk2V.value)
                    this.addV2Vk(Vk2V.Vk, Vk2V.value)
                }
            }
        },

        /**
         * 为已经存在的label做准备
         * @param Vk2V
         */
        async startToUpdate(Vk2V) {
            console.info("@@@@@@@@@@开始更新")
            //            V2VK唯一化
            this.uniqueV2Vk(Vk2V, true)
            //            一定要等待唯一化完成！
        },


        async updateTempStorage(Vk2V) {
            //            只是需要更新VK2V即可
            console.info("@@@@@@@@@@@@@@update method"+JSON.stringify(Vk2V))
            await this.updateVk2V(Vk2V.Vk, Vk2V.value);
        },
        //        @@@@@@@@@@@@@@@@@ widget处理结束 @@@@@@@@@@@@@@@@@@@@@@@@@


        async submitUpdate(){
//            对widgetList做异步持久化
            console.warn("@@@@@@@@@@@@@@submit start in storage----"+JSON.stringify(this.widgetList))

            for(let index in this.widgetList){
                let Vk=await this.widgetList[index].Vk
                let label=await this.widgetList[index].label
                let value=await this.selectValue(Vk);

                console.info("@@@@@@@@@submit update"+Vk+"!!!!!!!"+value)
//                开始更新
//                1.查看V2VK是否存在一样的值
                let sameValueVk=await this.selectVkByValue(value);
                console.info("@@@@@@@@@@@same value vk"+sameValueVk)
                if (sameValueVk) {
//                    如果存在,获取该Vk,更新label:Vk,
                    await this.updateLabel(label,sameValueVk)
//                    判断V2VK的记录是新还是旧,如果是新记录则删除该VK下的V2VK和VK2V记录
                   let uniVkValue= await this.selectVkByValue(Vk);
                    if (uniVkValue===Vk) {
//                        新纪录删除,该Vk下的V2VK和VK2V记录；此时uniVkValue是Vk
                        this.deleteV2Vk(Vk)
                        this.deleteVK2V(Vk)
                    }else{
//                        旧记录，V2VK，VK2V还原旧值;此时uniVkValue是旧值
//                        还原VK2v
                        this.updateVk2V(Vk,uniVkValue);
//                        复原V2VK
                        await this.deleteV2Vk(Vk);
                        this.addV2Vk(uniVkValue,Vk);
                    }
                }else if(!sameValueVk){
//                    如果不存在一样的value
//                        还原V2VK,更新value即可
                    console.info("@@@@@@@V2VK存储新值")
                    await this.deleteV2Vk(Vk);
                    this.addV2Vk(value,Vk);

                }
            }
        },

        endurance(){
            this.storages.labelStorage.flush().then(_=>{

            }).catch(err=>{
                console.error("!!!!!!!!!!!!!!!!"+err+"!!!!!!!!!!!!!!!!")
            });
            this.storages.Vk2VStorage.flush().then(_=>{

            }).catch(err=>{
                console.error("!!!!!!!!!!!!!!!!"+err+"!!!!!!!!!!!!!!!!")
            });
            this.storages.V2VkStorage.flush().then(_=>{

            }).catch(err=>{
                console.error("!!!!!!!!!!!!!!!!"+err+"!!!!!!!!!!!!!!!!")
            });
        },

        //    -----------------------------CRUD--------------------------------


        //    TTTTTTTTTTTTTTTTTTTTTTTTT  labelStorage  TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT
        //            +++++++++++++++++++ add +++++++++++++++++++
        addLabel(key, value) {
            //            防止同名表项，同步放入！
            this.storages.labelStorage.putSync(key, value)
        },
        //            ------------------- delete  -------------------
        //            ^^^^^^^^^^^^^^^^^^^ update  ^^^^^^^^^^^^^^^^^^^
        updateLabel(key,value){
            console.info("@@@@@@@@@@storage update"+key+":"+value)
            this.storages.labelStorage.put(key, value).then().catch(err=>{
                console.error("!!!!!!!!!!!!!!!!"+err+"!!!!!!!!!storage update Label2VK!!!!!!!")
            })
        },
        //            ??????????????????? select  ???????????????????
        async selectVk(label) {
            let Vk=null
            await this.storages.labelStorage.get(label, "").then(value => {
                //                返回VK,交由checkLabel()再查询VK2V获取Value
                console.info("@@@@@@@@@storage Vk"+JSON.stringify(value))
                Vk=value
            }).catch(err => {
                //                返回给checkLabel,checkLabel创建新的键值对new VK,而后更具其填写的内容查找V2VK，若存在则覆盖。
                console.error("!!!!!!!!!!!!!!!!"+err+"!!!!!!!!!storage select Label2VK!!!!!!!")
            })
            return Vk
        },
        //    TTTTTTTTTTTTTTTTTTTTTTTTT  labelStorage  TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT


        //    TTTTTTTTTTTTTTTTTTTTTTTTT  Vk2VStorage  TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT
        //            +++++++++++++++++++ add +++++++++++++++++++
        addVk2V(key, value) {
            this.storages.Vk2VStorage.putSync(key, value)
        },
        //            ------------------- delete  -------------------
        deleteVK2V(key) {
            this.storages.V2VkStorage.deleteSync(key).then().catch(err=>{
                console.error("!!!!!!!!!!!!!!!!"+err+"!!!!!!!!!storage delete VK2V!!!!!!!")
            })
        },
        //            ^^^^^^^^^^^^^^^^^^^ update  ^^^^^^^^^^^^^^^^^^^
        updateVk2V(key, value) {
            this.storages.Vk2VStorage.put(key, value).then().catch(err=>{
                console.error("!!!!!!!!!!!!!!!!"+err+"!!!!!!!!!storage update VK2V!!!!!!!")
            })
        },

        //            ??????????????????? select  ???????????????????
        async selectValue(Vk) {
            let loadValue=null
            await this.storages.Vk2VStorage.get(Vk, "").then(value => {
                //                返回Value,交由checkLabel()返回到Fcomponent
                console.info("@@@@@@@@@@@old value"+value)
                loadValue=value
            }).catch(err => {
                //                Vk不存在，初始化曾异常
                console.error("!!!!!!!!!!!!!!!!"+err+"!!!!!!!!!storage select VK2V!!!!!!!")
            })
            return loadValue;
        },
        //    TTTTTTTTTTTTTTTTTTTTTTTTT  Vk2VStorage  TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT


        //    TTTTTTTTTTTTTTTTTTTTTTTTT  V2VkStorage  TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT
        //            +++++++++++++++++++ add +++++++++++++++++++
        addV2Vk(key, value) {
            this.storages.V2VkStorage.putSync(key, value).then().catch(err=>{
                console.error("!!!!!!!!!!!!!!!!"+err+"!!!!!!!!!storage add V2VK!!!!!!!")
            })
        },
        //            ------------------- delete  -------------------
        deleteV2Vk(key) {
            this.storages.V2VkStorage.deleteSync(key).then().catch(err=>{
                console.error("!!!!!!!!!!!!!!!!"+err+"!!!!!!!!!storage delete V2VK!!!!!!!")
            })
        },
        //            ^^^^^^^^^^^^^^^^^^^ update  ^^^^^^^^^^^^^^^^^^^

        //            ??????????????????? select  ???????????????????
        async selectVkByValue(value) {
            let Vk=null
            await this.storages.Vk2VStorage.get(value, "").then(value => {
                //                返回Value,交由checkLabel()返回到Fcomponent
                Vk=value
            }).catch(err => {
                //                Vk不存在，初始化曾异常
                console.error("!!!!!!!!!!!!!!!!"+err+"!!!!!!!!!storage select V2VK!!!!!!!")
            })
            return Vk
        },
        async hasV2Vk(key) {
            let isExist = false;
            await this.storages.V2VkStorage.has(key).then(isExisted => {
                isExist = isExisted
            }).catch(err=>{
                console.error("!!!!!!!!!!!!!!!!"+err+"!!!!!!!!!storage has V2VK!!!!!!!")
            })
            return isExist
        }
        //    TTTTTTTTTTTTTTTTTTTTTTTTT  V2VkStorage  TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT
    }
}