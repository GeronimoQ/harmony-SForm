const Bus = {
    // 事件集合
    _events:{ },

    /**
     * 绑定事件
     * type: string 字符串
     * fun: function 绑定的方法
     * return: 返回绑定事件对应的标签，用于注销事件
     * */
    $on(type,fun){
        let res = "";
        if(type && typeof type == "string" && fun &&　typeof fun　=="function"){
            let events = this._events[type];
//            是否已经存在
            if(events){
                let index = events.findIndex(null);
                if(index > -1){
                    res = `${String(index)}${type}`;
                    events[index] = fun;
                }else{
                    events.push(fun);
                }
            }else{
                this._events[type] = [fun];
                res = `0${type}`;
            }
        }
        return res;
    },

    /**
     * 触发事件
     * type: string 发布事件的字符串
     * args: 传参
     * */
    $emit(type,...args){
        if(type && typeof type == "string"){
            let events = this._events[type];
            if(events){
                events.forEach(fun => {
                    if(fun &&　typeof fun　=="function"){
                        fun(...args);
                    }
                });
            }
        }
    },

    /**
     * 注销事件方法
     * type: string 字符串
     * fun: string|function 发布事件时返回的值或者发布的原function
     * */
    $off(type,fun){
        if(type && typeof type == "string" && fun){
            let events = this._events[type];
            if(events){
                if(typeof fun == "string"){
                    let indexStr = fun.replace(type,'');
                    let index = parseInt(indexStr);
                    if(Number.isInteger(index)){
                        events[index] = null;
                    }
                }
                if(typeof fun == "function"){
                    events.forEach(item => {
                        if(item == fun){
                            item = null;
                        }
                    });
                }
            }
        }
    }
}
export default Bus;
