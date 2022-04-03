
import dataStorage from '@ohos.data.storage';
import featureAbility from '@ohos.ability.featureAbility';
import prompt from '@system.prompt';


async function getStorageObj(){
    let context = featureAbility.getContext()
    let path = await context.getFilesDir()
    let storagePath = path + "/userInfo"
    await　dataStorage.getStorage(storagePath).then(data => {
        return data;
    }).catch(error => {
        console.error("获取用户数据失败--------" + error)
    })
    return null;
}

var id=null;
var userId=null;
var userName=null;
var groupId=null;
var groupName=null;
var joined=false;

async function getUser(){
   let storage= getStorageObj()
   if (storage!=null) {

   }
}

async function getUserId(){

}
async function getUserName(){

}
async function getGroupId(){

}
async function getGroupName(){

}
async function isJoined(){

}
