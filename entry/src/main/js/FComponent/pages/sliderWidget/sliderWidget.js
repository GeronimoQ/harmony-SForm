import prompt from '@system.prompt';
export default {
    props:{
        widgetConfig:{
            default:null
        }
    },
    data: {
        widgetInfo:{
            value:0,
            widgetCopy:''
        }
    },

    async sliderChange(changeEvent){

        if (changeEvent.mode==='end') {
            this.widgetInfo.value=changeEvent.value
            await this.submitValue()
        }
        if (changeEvent.value===this.widgetConfig.options.max) {
            prompt.showToast({message:"已经到顶啦~"})
        }

    },

    submitValue(){
        let data={
            fillData:this.widgetInfo.value
        }
        this.$emit("fillData",data);
    },
}
