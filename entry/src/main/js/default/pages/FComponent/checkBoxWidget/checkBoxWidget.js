import { isNumber } from '../../../../util/util.js';
import prompt from '@system.prompt';
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
        },
        checkedOptions:new Map()
    },
    onActive(){
        this.initCheckOptions()
    },

    initCheckOptions(){
        let options =this.widgetConfig.options.optionItems
        for(let option in options){
            this.checkedOptions.set(options[option].value,false)
        }
    },

    submitValue(){
        let data={
            fillData:this.widgetInfo.value
        }
        this.$emit("fillData",data);
    },

    checkBoxValueChange(checked){
//        check是个对象！
        let checkedOps=[]
        let value=checked.currentTarget.attr.value
        if (checked.checked) {
            this.checkedOptions[value]=true
        }else{
            this.checkedOptions[value]=false
        }
//       遍历MAP对象，将其中值为true的拿出
        for(let key in this.checkedOptions){
            if (this.checkedOptions[key]) {
                if(isNumber(key)){
                    checkedOps.push(parseInt(key))
                }else{
                    checkedOps.push(key)
                }

            }
        }
        this.widgetInfo.value=checkedOps
        this.submitValue()
    },
}
