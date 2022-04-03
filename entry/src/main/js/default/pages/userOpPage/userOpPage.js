import {register, changePwd} from '../../../api/userAPI.js';
import prompt from '@system.prompt';
import router from '@system.router';
import dataStorage from '@ohos.data.storage';
import featureAbility from '@ohos.ability.featureAbility';

export default {
    props: {
        userInfo: {
            default: null,
        },
        opType: {
            default: "register",
        }
    },
    data: {
        userId: '',
        userName: '',
        oldPassword: '',
        newPassword: '',
        checkPassword: '',
    },

    userIdValueChange(value) {
        this.userId = value.value.trim()
    },

    nameValueChange(value) {
        this.userName = value.value.trim()
    },

    oldPasswordValueChange(value) {
        this.oldPassword = value.value.trim()
    },
    newPasswordValueChange(value) {
        this.newPassword = value.value.trim()
    },
    checkPasswordValueChange(value) {
        this.checkPassword = value.value.trim()
    },


    passwordCheck() {
        if (this.newPassword === this.checkPassword) {
            return true
        } else {
            prompt.showToast({
                message: "输入的密码不一致!"
            })
            return false
        }
    },


    register() {
        if (this.passwordCheck()) {
            let params = {
                "groupId": "",
                "id": "",
                "joined": true,
                "password": this.newPassword,
                "userId": this.userId,
                "userName": this.userName
            }

            register(params).then(res => {
                prompt.showToast({
                    message: res.result
                })
                setTimeout(_ => {
                    router.back();
                }, 1000)
            }).catch()
        }
    },

    changePwd() {
        if (this.passwordCheck()) {
            let params = {
                id: this.userInfo.id,
                oldPwd: this.oldPassword,
                newPwd: this.newPassword
            }
            changePwd(params).then(res => {
                prompt.showToast({
                    message: res.result
                })
                setTimeout(this.logout(), 1000)
                this.logout()
            }).catch()
        }

    },

    async logout() {
        let context = featureAbility.getContext()
        let path = await context.getFilesDir()

        let storagePath = path + "/userInfo"

        await dataStorage.deleteStorage(storagePath).then(() => {
            console.info("Deleted successfully.")
            router.push({
                uri: "pages/index/index"
            })
        }).catch((err) => {
            console.info("Deleted failed with err: " + err)
        })
    }
}
