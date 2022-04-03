// @ts-nocheck
import router from '@system.router';
import {login, register,updateUserInfo} from "../../../api/userAPI.js"
import dataStorage from '@ohos.data.storage';
import featureAbility from '@ohos.ability.featureAbility';
import wantConstant from '@ohos.ability.wantConstant';
import prompt from '@system.prompt';
// abilityType: 0-Ability; 1-Internal Ability
const ABILITY_TYPE_EXTERNAL = 0;
const ABILITY_TYPE_INTERNAL = 1;
// syncOption(Optional, default sync): 0-Sync; 1-Async
const ACTION_SYNC = 0;
const ACTION_ASYNC = 1;

export default {
    data: {
        userId: "",
        password: ""
    },
    onInit() {
        this.title = this.$t('strings.world');

    },
    onShow(){
        this.updateLoginedUser()
    },
    userIdValueChange(value) {
        this.userId = value.value
    },
    passwordValueChange(value) {
        this.password = value.value
    },

    async updateLoginedUser() {
        let context = featureAbility.getContext()
        let path = await context.getFilesDir()
        let storagePath = path + "/userInfo"
        let storage = null;

        await dataStorage.getStorage(storagePath).then(data => {
            storage = data;
        }).catch(error => {
            console.error("获取用户数据失败--------" + error)
        })

        if (storage !== null) {
            console.info("开始获取UserInfo")

            await storage.get("userInfo", "default").then(userInfo => {

                if (userInfo === "default") {
                    //                    未登录
                    prompt.showToast({
                        message: "请先登录!"
                    });
                } else {
                    this.userInfo = JSON.parse(userInfo);
                    console.info("获取用户数据成功");
                    prompt.showToast({
                        message: "已经登录!"
                    });
                    //                    更新用户数据
                    this.getUserInfo(userInfo.id)
                    setTimeout(_ => {
                        router.push({
                            uri: "pages/first_page/first_page"
                        })
                    },1000)
                }

            }).catch(error => {
                console.error("用户信息读取失败" + error);
            })
        }
    },
    async getUserInfo(Id){
        let params={
            id:id
        }
        updateUserInfo(params).then(res=>{
            this.storageUserInfo(res.result)
        }).catch()
    },

    async login() {
        let params = {
            groupId: "",
            id: "",
            joined: true,
            password: this.password,
            userId: this.userId,
            userName: ""
        }
        await login(params).then(res => {
            console.info("登录responese" + JSON.stringify(res))
            this.storageUserInfo(res.result)
        }).catch()
    },

    async storageUserInfo(userInfo) {
        let context = featureAbility.getContext()
        let path = await context.getFilesDir()
        let storagePath = path + "/userInfo"
        let userInfoStorage = null
        await dataStorage.getStorage(storagePath).then(data => {
            console.info("获取存储文件成功")
            userInfoStorage = data
        }).catch(error => {
            console.error("登录失败--------" + error)
            prompt.showToast({
                message: "登陆失败:存储错误1"
            })
        });

        if (userInfoStorage !== null) {
            let user = JSON.stringify(userInfo)
            console.info("存储用户信息" + user)
            await userInfoStorage.put("userInfo", user).then(_ => {
                console.info("存储用户信息成功")
                prompt.showToast({
                    message: "登录成功"
                })
            }).catch(error => {
                console.error("登录失败--------" + error)
                prompt.showToast({
                    message: "登陆失败:存储错误2"
                })
            });
            await userInfoStorage.flush().then(_ => {
                console.info("存储成功");
                setTimeout(_ => {
                    console.log("跳转到首页")
                    router.push({
                        uri: "pages/first_page/first_page"
                    })
                }, 500)
            }).catch(_ => {
                //                    存储失败
            });

        }
    },
    jumpToRegister() {
        router.push({
            uri: "pages/userOpPage/userOpPage",
            params: {
                opType: "register"
            }
        })
    },

}
