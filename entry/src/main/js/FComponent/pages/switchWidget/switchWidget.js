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

    switchChange(checked){
        this.widgetInfo.value=checked.checkedValue
    },

    submitValue(){
        var widgetConfig=JSON.parse(JSON.stringify(this.widgetConfig));
        this.widgetInfo.widgetCopy=widgetConfig;
        this.$emit("fillData",JSON.stringify(this.widgetInfo));
    }
}
