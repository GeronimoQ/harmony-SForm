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


    async valueChange(value){
//        { text: newText, lines: textLines, height: textHeight }
        this.widgetInfo.value=value.text
        await this.submitValue()
    },
    submitValue(){
        let data={
            fillData:this.widgetInfo.value
        }
        this.$emit("fillData",data);
    },
}
