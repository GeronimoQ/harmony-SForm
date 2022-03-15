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
        }
    },

    getWidgetFillData(e){
        let fillData=JSON.parse(e)
        prompt.showToast({message:e.value})
    }
}
