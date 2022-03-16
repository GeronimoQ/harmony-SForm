export default {
    props: {
        widgetConfig: {
            default: null
        }
    },
    data: {
        widgetInfo: {
            value: '',
            widgetCopy: ''
        }
    },

    async switchChange(checked) {
//        { checked: checkedValue }
        this.widgetInfo.value = checked.checked
        await this.submitValue()
    },

    submitValue() {
        let data = {
            fillData: this.widgetInfo.value
        }

        this.$emit("fillData", data);
    },
}
