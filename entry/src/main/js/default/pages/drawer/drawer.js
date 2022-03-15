import Animator from '@ohos.animator';

// 菜单宽度缩放比
const MENU_WIDTH_SCALE = 0.75;
// 动画时长
const ANIMATOR_DURATION = 250;

export default {
    // 使用外部传入
    props: ['showStyle'],// 显示样式：0菜单在下面，1菜单在上面
    data: {
        offsetLeft: 0, // 手指滑动距左偏移量
        menuWidth: 0, // 菜单宽度
        menuOffsetLeft: 0, // 菜单左偏移量
        menuBgOpacity: 0, // 菜单背景透明度
        pressX: 0, // 按下时X坐标
        pressTime: 0, // 按下时的时间戳
        lastX: 0, // 上次X坐标
        animator: null, // 动画
        zIndexMenu: 0, // 菜单渲染顺序：值越大，渲染靠后，浮在其他组件上面
        zIndexContent: 0, // 内容渲染顺序：值越大，渲染靠后，浮在其他组件上面
    },

    /**
     * 初始化
     */
    onInit() {
        this.animator = Animator.createAnimator({});
        setTimeout(() => {
            // 获取容器的宽度
            var containerWidth = this.$element('drawer-container').getBoundingClientRect().width
            // 设置菜单的宽度
            this.menuWidth = containerWidth * MENU_WIDTH_SCALE

            // showStyle 显示样式：0菜单在下面，1菜单在上面
            if (this.showStyle == 0) {
                this.zIndexMenu = 0
                this.zIndexContent = 1
                this.offsetLeft = 0

                // 设置菜单偏移量为负的菜单宽度，为了解决z-index设置后，菜单界面到内容下面，
                // 事件还停留到内容上面，导致点击菜单区域，响应的还是菜单点击事件
                this.menuOffsetLeft = -this.menuWidth
            } else {
                this.zIndexMenu = 1
                this.zIndexContent = 0
                this.offsetLeft = -this.menuWidth
                this.menuOffsetLeft = this.offsetLeft
            }
        }, 30)
    },
    /**
     * 界面显示
     */
    onShow() {
        this.startAnimator(100)
    },
    /**
     * 触摸按下
     */
    onTouchStart(event) {
        // 记录首次按下的x坐标
        this.pressX = event.touches[0].localX
        this.lastX = this.pressX
        // 记录首次按下的时间戳
        this.pressTime = event.timestamp
    },
    /**
     * 触摸移动
     */
    onTouchMove(event) {
        // 当前x坐标
        let localX = event.touches[0].localX
        // 计算与上次的x坐标的偏移量
        let offsetX = this.lastX - localX;
        // 记录上次的x坐标
        this.lastX = localX
        // 累计偏移量
        this.offsetLeft -= offsetX

        // showStyle 显示样式：0菜单在下面，1菜单在上面
        if (this.showStyle == 0) {
            // 设置偏移量的范围
            if (this.offsetLeft < 0) {
                this.offsetLeft = 0
            } else if (this.offsetLeft > this.menuWidth) {
                this.offsetLeft = this.menuWidth
            }
        } else {
            // 设置偏移量的范围
            if (this.offsetLeft > 0) {
                this.offsetLeft = 0
            } else if (this.offsetLeft < -this.menuWidth) {
                this.offsetLeft = -this.menuWidth
            }
        }

        this.changeMenuOffsetLeft()
    },
    /**
     * 改变菜单偏移量
     */
    changeMenuOffsetLeft() {
        // showStyle 显示样式：0菜单在下面，1菜单在上面
        if (this.showStyle == 0) {
            // 设置菜单偏移量
            if (this.offsetLeft == 0) {
                this.menuOffsetLeft = -this.menuWidth
            } else {
                this.menuOffsetLeft = -this.menuWidth / 3 + this.offsetLeft / 3
            }
        } else {
            // 设置菜单偏移量
            this.menuOffsetLeft = this.offsetLeft
            // 改变菜单背景的透明度
            this.menuBgOpacity = 1 - Math.abs(this.offsetLeft / this.menuWidth)
        }
    },
    /**
     * 触摸抬起
     */
    onTouchEnd(event) {
        let offsetX = this.pressX - this.lastX;
        if (offsetX == 0) {
            return
        }
        // 滑向的x坐标
        var toX = 0
        // 快速滑动
        if (event.timestamp - this.pressTime < 300) {
            if (Math.abs(offsetX) > 10) {
                // showStyle 显示样式：0菜单在下面，1菜单在上面
                if (this.showStyle == 0) {
                    if (offsetX > 0) {
                        toX = 0
                    } else {
                        toX = this.menuWidth
                    }
                } else {
                    if (offsetX > 0) {
                        toX = -this.menuWidth
                    } else {
                        toX = 0
                    }
                }
            }
        } else {
            // showStyle 显示样式：0菜单在下面，1菜单在上面
            if (this.showStyle == 0) {
                // 当移动偏移量大于菜单一半宽度，完全打开菜单，否则反之
                if (this.offsetLeft > this.menuWidth / 2) {
                    toX = this.menuWidth
                } else {
                    toX = 0
                }
            } else {
                if (this.offsetLeft > -this.menuWidth / 2) {
                    toX = 0
                } else {
                    toX = -this.menuWidth
                }
            }
        }
        // 开启动画
        this.startAnimator(toX)
    },
    /**
     * 开启动画
     */
    startAnimator(toX) {
        // 设置动画参数
        let options = {
            duration: ANIMATOR_DURATION, // 持续时长
            fill: 'forwards', // 启停模式：保留在动画结束状态
            begin: this.offsetLeft, // 起始值
            end: toX // 结束值
        };
        // 更新动画参数
        this.animator.update(options)
        // 监听动画值变化事件
        this.animator.onframe = (value) => {
            this.offsetLeft = value
            this.changeMenuOffsetLeft()
        }
        // 开启动画
        this.animator.play()
    },
    /**
     * 打开菜单
     */
    openMenu() {
        let offsetX = this.pressX - this.lastX;
        if (offsetX == 0) {
            // 如果菜单关闭，则开启
            if (this.showStyle == 0) {
                if (this.offsetLeft == 0) {
                    this.startAnimator(this.menuWidth);
                }
            } else {
                if (this.offsetLeft == -this.menuWidth) {
                    this.startAnimator(0);
                }
            }
        }
    },
    /**
     * 关闭菜单
     */
    closeMenu() {
        let offsetX = this.pressX - this.lastX;
        if (offsetX == 0) {
            // 如果菜单开启，则关闭
            if (this.showStyle == 0) {
                if (this.offsetLeft == this.menuWidth) {
                    this.startAnimator(0);
                }
            } else {
                if (this.offsetLeft == 0) {
                    this.startAnimator(-this.menuWidth);
                }
            }
        }
    },
    clickMenu(){
        // 设置点击菜单事件，消费点击事件，防止透到底部内容区域
    }
}
