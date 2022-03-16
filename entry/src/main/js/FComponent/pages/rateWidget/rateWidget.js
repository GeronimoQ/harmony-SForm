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
   async rateChange(rating){
        this.widgetInfo.value=rating.rating
        await this.submitValue()
    },

    submitValue(){
        let data={
            fillData:this.widgetInfo.value
        }
        this.$emit("fillData",data);
    },


}
