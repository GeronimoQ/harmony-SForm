import prompt from '@system.prompt';
export default {
    props: {
        widget:{
            default:null
        }
    },
    data: {
        visible: {
            inputVB: false,
            textareaVB: false
        },
        fillData:null,
    },

    getWidgetFillData(e){
        let value=e.detail.fillData
        let widgetCopy=this.widget
        let fillData={
            value:value,
            widgetCopy:widgetCopy
        }
        prompt.showToast({message:value})
        this.$emit()
    },

}
