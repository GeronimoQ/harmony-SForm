import featureAbility from '@ohos.ability.featureAbility';
import prompt from '@system.prompt';
function aceIntent(deviceId,bundleName,abilityName,uri,options,action,entities,flags){
    return{
        "want": {
            "deviceId": deviceId, //表示运行指定Ability的设备ID
            "bundleName": bundleName, //表示包描述。如果在Want中同时指定了BundleName和AbilityName，则Want可以直接匹配到指定的Ability。
            "abilityName": abilityName, //	表示待启动的Ability名称。如果在Want中同时指定了BundleName和AbilityName，则Want可以直接匹配到指定的Ability。
            "uri": uri, //表示Uri描述。如果在Want中指定了Uri，则Want将匹配指定的Uri信息，包括scheme, schemeSpecificPart, authority和path信息。
            "type": "image/*", //表示MIME type类型描述，比如："text/plain" 、 "image/*"等。
            "options": {}, //
            "action": "", //表示action选项描述。具体参考：Action使用时通过wantConstant.Action获取，示例：wantConstant.Action.ACTION_HOME。
            "parameters": {}, // 表示WantParams描述

            "entities":entities ,//表示entities相关描述。具体参考：Entity 使用时通过wantConstant.Entity获取，示例：wantConstant.Entity.ENTITY_DEFAULT。
            "flags":flags //表示处理Want的方式。默认传数字，具体参考：Flags 使用时通过wantConstant.Flags获取，示例：wantConstant.Flags.FLAG_INSTALL_ON_DEMAND。


        },
        "abilityStartSetting": {}, // 表示能力的特殊属性，当开发者启动能力时，该属性可以作为调用中的输入参数传递。
        "taskSyncAnimationOptions":{} //	启动Ability时需要进行动画控制的特殊属性，当开发者希望控制启动Ability的动画时，请传入该参数，需要权限ohos.permission.CONTROL_TASK_SYNC_ANIMATOR。

    }
}
/**
 * Version 6
 * @param parameter 通过aceIntent返回的对象
 * @param abilityInstance ability实例
 */
function startAbility(parameter,abilityInstance){
    featureAbility.startAbility(parameter).then((data) => {
        console.info('Operation successful. Data: ' + JSON.stringify(data))
    }).catch((error) => {
        console.error('Operation failed. Cause: ' + JSON.stringify(error));
    })
}
/**
 * Version 7
 * @param parameter 通过aceIntent返回的对象
 * @param abilityInstance ability实例
 */
function startAbilityForResult(parameter,abilityInstance){
    featureAbility.startAbilityForResult(parameter).then((data) => {
        console.info('Operation succeeded: ' + data);
        prompt.showDialog({title:data})
    }).catch((error) => {
        console.error('Operation failed. Cause: ' + error);
    })
}

const IFeatureAbility ={
    "aceIntent":aceIntent,
    startAbility:startAbility,
    startAbilityForResult:startAbilityForResult
}
export default IFeatureAbility;