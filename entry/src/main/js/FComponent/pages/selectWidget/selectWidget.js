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
    async selectChange(newValue){
        this.widgetInfo.value=newValue.newValue
        await this.submitValue()
    },
    submitValue(){
        let data={
            fillData:this.widgetInfo.value
        }
        this.$emit("fillData",data);
    },
}
