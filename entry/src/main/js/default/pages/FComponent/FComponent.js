import prompt from '@system.prompt';

export default {
    props: {
        widget: {
            default: null
        },
        designer: {
            default: null
        }
    },
    data: {
        visible: {
            inputVB: false,
            textareaVB: false
        },
        fillData: null,
        parentEvent: ""
    },

    async getWidgetFillData(e) {
        let value = e.detail.fillData
        let widgetCopy = JSON.parse(JSON.stringify(this.widget))

        let fillData = {
            value: value,
            widgetCopy: widgetCopy
        }

        this.setWidgetFillData(fillData)
    },
    setWidgetFillData(fillData) {
        console.info(JSON.stringify(fillData))
        this.designer.fillData[this.designer.indexMap.get(fillData.widgetCopy.id)].value=fillData.value
    }
}
