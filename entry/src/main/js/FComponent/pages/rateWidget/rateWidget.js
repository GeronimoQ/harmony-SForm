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
    rateChange(rating){
        this.widgetInfo.value=rating.rating
    },

    submitValue(){
        var widgetConfig=JSON.parse(JSON.stringify(this.widgetConfig));
        this.widgetInfo.widgetCopy=widgetConfig;
        this.$emit("fillData",JSON.stringify(this.widgetInfo));
    }


}
