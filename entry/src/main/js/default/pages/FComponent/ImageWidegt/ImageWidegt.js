import prompt from '@system.prompt';

export default {
    props: {
        widgetConfig: {
            default: null
        },
    },
    data: {
        imgAddIconPath: "common/img.png",
        imgDelIconPath: "",
        imgShowBase64: [],
        startAdd: false,
        widgetInfo: {
            value: '',
            widgetCopy: ''
        }
    },


    async addImage() {
        var that = this
        //        检查数量
        if (that.widgetConfig.options.multipleSelect) {
            if (that.imgShowBase64.length <= that.widgetConfig.options.limit) {
                // @ts-ignore
                var javaInterface = await createLocalParticleAbility('com.example.learnmyapplication_ark.QrScanningServiceAbility');
                await javaInterface.startToSelectImage().then(data => {
                    console.error("!!!!!+data");
                    that.imgShowBase64.push(data);
                    that.startAdd = true;
                    that.ImgChange();
                }).catch(error => {
                    console.info("调用失败")
                })
            } else {
                prompt.showToast({
                    message: "有限制的，不能再给了~"
                })
            }
        } else {
            //            单选
            if (that.imgShowBase64.length === 0) {
                // @ts-ignore
                var javaInterface = await createLocalParticleAbility('com.example.learnmyapplication_ark.QrScanningServiceAbility');
                await javaInterface.startToSelectImage().then(data => {
                    console.error("!!!!!+data");
                    that.imgShowBase64.push(data);
                    that.startAdd = true;
                    that.ImgChange();
                }).catch(error => {
                    console.info("调用失败")
                })
            } else {
                prompt.showToast({
                    message: "有限制的，不能再给了~"
                })
            }
        }

    },


    async delLast() {
        await this.imgShowBase64.pop();
        this.ImgChange();
    },

    async ImgChange() {
        this.widgetInfo.value = this.imgShowBase64
        await this.submitValue("fillData")
    },

    submitValue(emitName) {
        let data = {
            fillData: this.widgetInfo.value
        }
        this.$emit(emitName, data);
    },

    //    canvas方案
    //    setCanvas(url) {
    //        console.info("开始加载图片")
    //
    //        const el = this.$refs.canvas;
    //        var ctx = el.getContext("2d");
    //        var img = new Image();
    //
    //        img.src = url;
    //
    //        img.onload = function() {
    //            console.log('Image load success');
    ////            ctx.scale(0.5,0.5)
    //            ctx.drawImage(img, 0, 0, 100,100);
    //        };
    //        img.onerror = this.loadCanvasFail();
    //    },
    //
    //    loadCanvasFail() {
    //        prompt.showToast({
    //            message: "图片加载失败!"
    //        })
    //    },
    //
    //    canvasDrawImg(img) {
    //        console.info("绘制")
    //        const el = this.$refs.imgShow;
    //        var ctx = el.getContext("2d");
    //        ctx.scale(0.5, 0.5)
    //        ctx.drawImage(img, 0, 0, img.width, img.height);
    //    }

}