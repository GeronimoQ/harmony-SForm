package com.example.learnmyapplication_ark;

import ohos.aafwk.ability.AbilitySliceAnimator;
import ohos.aafwk.content.Intent;
import ohos.aafwk.content.Operation;
import ohos.ace.ability.AceAbility;
import ohos.bundle.IBundleManager;
import ohos.event.commonevent.CommonEventData;
import ohos.event.commonevent.CommonEventManager;
import ohos.event.commonevent.CommonEventPublishInfo;
import ohos.hiviewdfx.HiLog;
import ohos.hiviewdfx.HiLogLabel;
import ohos.rpc.RemoteException;
import ohos.security.SystemPermission;

public class MainAbility extends AceAbility {
    private static final HiLogLabel LABEL_LOG = new HiLogLabel(3, 0xD001100, "MainAbility");
    /**
     * request Code.
     */
    private static final int REQUEST_CODE = 20210601;

    @Override
    public void onStart(Intent intent) {
        QrScanningServiceAbility instance = QrScanningServiceAbility.getINSTANCE();
        instance.register(this);
        super.onStart(intent);
        addActionRoute(Intent.ACTION_QUERY_WEATHER, MainAbility.class.getName());

        // 取消页面切换动画
        setAbilitySliceAnimator(new AbilitySliceAnimator().setDuration(0));
        requestPermission();
    }

    /**
     * 申请权限.
     */
    private void requestPermission() {
        // 必须手动权限
        if (verifySelfPermission(SystemPermission.CAMERA)
                != IBundleManager.PERMISSION_GRANTED) {
            // has no permission
            if (canRequestPermission(SystemPermission.CAMERA)) {
                // toast
                requestPermissionsFromUser(
                        new String[]{SystemPermission.CAMERA}, REQUEST_CODE);
            }
        }
    }

    @Override
    public void onStop() {
        QrScanningServiceAbility.getINSTANCE().deregister(this);
        super.onStop();
    }


    //    @TODO PA开发：获取任务以及模板信息


    /*
     * 发布有序的公共事件
     */
    private void orderlyEventPublish(String data) {
        HiLog.info(LABEL_LOG, "发布有序公共事件开始");
        //1.构建一个Intent对象，包含了自定义的事件的标识符
        Intent intent = new Intent();
        Operation oper = new Intent.OperationBuilder().withAction(Intent.ACTION_QUERY_WEATHER) //就是自定义的公共事件的标识
                .build();
        intent.setOperation(oper);
        //2.构建CommonEventData对象
        CommonEventData commonEventData = new CommonEventData(intent);

        //仅仅只有有序的公共事件，才能携带的两个专用属性,可选的参数，不是必须的
        commonEventData.setData(data);
        commonEventData.setCode(1001);
        //配置公共事件的对应权限
        CommonEventPublishInfo publishInfo = new CommonEventPublishInfo();
        publishInfo.setOrdered(true);

        //3.核心的发布事件的动作,发布的公共事件，有序的公共事件
        try {
            CommonEventManager.publishCommonEvent(commonEventData, publishInfo);
            HiLog.info(LABEL_LOG, "发布有序公共事件完成");
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }


    /**
     * 跳转回调
     */
    @Override
    protected void onAbilityResult(int requestCode, int resultCode, Intent resultData) {
//        super.onAbilityResult(requestCode, resultCode, resultData);
        try {
            if (requestCode == 1001 && resultCode == 0) {
                System.out.println("APP LOG resultData：" + resultData.getUriString());
                // 通过发布有序公共事件传递信息
                orderlyEventPublish(resultData.getStringParam("taskId").toString());
            }

        } catch (Exception e) {
            orderlyEventPublish("fail");
            e.printStackTrace();
        }
    }
}
