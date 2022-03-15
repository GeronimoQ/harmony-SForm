export default {
    props:{
        widgetConfig:{
            default:null
        }
    },
    data: {
        widgetInfo:{
            value:'',
            widgetCopy:''
        }
    },
    submitValue(){
        console.error(this.widgetInfo.value)
        var widgetConfig=JSON.parse(JSON.stringify(this.widgetConfig));
        this.widgetInfo.widgetCopy=widgetConfig;
        this.$emit("fillData",JSON.stringify(this.widgetInfo));
    }
}
