import prompt from '@system.prompt';
export default {
    props:{
        widgetConfig:{
            default:null
        }
    },
    data: {
        curIndex:-1,
        widgetInfo:{
            value:[],
            widgetCopy:''
        },
        checkedOptions:new Map()
    },
    onShow(){
        this.initCheckOptions()
    },

    initCheckOptions(){
        let options =this.widgetConfig.options.optionItems
        for(let option in options){
            this.checkedOptions.set(options[option].value,false)
        }
    },

    submitValue(){
        console.info("!!!!"+JSON.stringify(this.widgetInfo.value))
        let data={
            fillData:this.widgetInfo.value
        }
        this.$emit("fillData",data);
    },

    async getIndex(index){
        console.info("@@@@@@@@@"+index)
    },

    async checkBoxValueChange(checked,index){
        console.info("@@@@@@@@@"+checked)
        let checkedOps=[]
        let value=this.widgetConfig.options.optionItems[index].value
        if (checked) {
            this.checkedOptions.set(value,true)
        }else{
            this.checkedOptions.set(value,false)
        }
//       遍历MAP对象，将其中值为true的拿出
        for(let key in this.checkedOptions.keys()){
            if (this.checkedOptions.get(key)) {
                checkedOps.push(this.checkedOptions.get(key))
            }
        }
        this.widgetInfo.value=checkedOps
        await this.submitValue()
    },
}
