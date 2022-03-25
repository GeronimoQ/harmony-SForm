import prompt from '@system.prompt';

export default {
    props: {
        widget: {
            default: null
        },
        designer: {
            default: null
        },
        tempStorage:{
            default:null
        }
    },
    data: {
        visible: {
            inputVB: false,
            textareaVB: false
        },
        fillData: null,
        parentEvent: "",
        Vk2V:{
            Vk:"",
            value:""
        }
    },


    onInit(){
      this.checkLabel();
    },

    async getWidgetFillData(e) {
        let value = e.detail.fillData
        let widgetCopy = JSON.parse(JSON.stringify(this.widget))

        let fillData = {
            value: value,
            widgetCopy: widgetCopy
        }
        this.Vk2V.value=value
        await this.setWidgetFillData(fillData)
        this.updateTempValue()
    },

    setWidgetFillData(fillData) {
        this.designer.fillData[this.designer.indexMap.get(fillData.widgetCopy.id)].value=fillData.value
    },


    /**
     * init检查表项是否存在，若存在取出值，放入defalutValue;若不存在后台自动注册新的表项到storage中
     * @param label
     */
    async checkLabel(){
        this.Vk2V=await this.tempStorage.checkLabel(this.widget.options.label)
        console.info("@@@@@@@@@@@return vk2v"+JSON.stringify(this.Vk2V))
    },

    /**
     * 当组件change发生，更新Vk2V
     * @param label
     */
    updateTempValue(){
        console.info("@@@@@@@@@@@@start to update in com"+JSON.stringify(this.Vk2V))
        this.tempStorage.updateTempStorage(this.Vk2V)
    },



}
