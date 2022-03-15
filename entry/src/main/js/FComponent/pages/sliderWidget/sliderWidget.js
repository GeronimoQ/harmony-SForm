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

    sliderChange(changeEvent){
        if (changeEvent.mode==='end') {
            this.widgetInfo.value=changeEvent.value
        }
        if (changeEvent.value===this.widgetConfig.options.max) {
            prompt.showToast({message:"已经到顶啦~"})
        }

    },

    submitValue(){
        var widgetConfig=JSON.parse(JSON.stringify(this.widgetConfig));
        this.widgetInfo.widgetCopy=widgetConfig;
        this.$emit("fillData",JSON.stringify(this.widgetInfo));
    }
}
