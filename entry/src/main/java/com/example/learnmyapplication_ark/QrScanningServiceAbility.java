package com.example.learnmyapplication_ark;

import com.example.learnmyapplication_ark.utils.Utils;
import ohos.aafwk.ability.Ability;
import ohos.aafwk.content.Intent;
import ohos.aafwk.content.Operation;
import ohos.ace.ability.AceAbility;
import ohos.ace.ability.LocalParticleAbility;
import ohos.event.commonevent.*;
import ohos.eventhandler.EventHandler;
import ohos.eventhandler.EventRunner;
import ohos.hiviewdfx.HiLog;
import ohos.hiviewdfx.HiLogLabel;
import ohos.rpc.RemoteException;

import java.util.concurrent.CountDownLatch;

public class QrScanningServiceAbility implements LocalParticleAbility {
    private static final HiLogLabel LABEL_LOG = new HiLogLabel(3, 0xD001100, "QrScanningService");
    private Ability abilityContext;
    private static final QrScanningServiceAbility INSTANCE = new QrScanningServiceAbility();

    /* 公共事件相关变量 */
    private boolean isSubscribe = false;
    private EventRunner runner = EventRunner.create();
    private EventHandler handler = new EventHandler(runner);
    private CommonEventSubscriber subscriber;

    /* 所需量传递 */
    private CountDownLatch latch;
    private Utils utils;
    private String photoUriString;

    private String QRDecode_str = null;

    public static LocalParticleAbility getInstance() {
        return INSTANCE;
    }

    private void startQRDecodeAbility() {
        Intent intent = new Intent();
//        Operation operation = new Intent.OperationBuilder()
//                .withAction(Intent.ACTION_QUERY_WEATHER)
//                .build();
        Operation operation = new Intent.OperationBuilder()
                .withBundleName("com.example.learnmyapplication_ark").withAbilityName("com.example.learnmyapplication_ark.ScanningQRAbility")
                .build();
        intent.setOperation(operation);
        abilityContext.startAbilityForResult(intent,1001);
    }

    public static QrScanningServiceAbility getINSTANCE() {
        return INSTANCE;
    }

    @Override
    public void register(AceAbility ability) {
        this.abilityContext = ability;
        LocalParticleAbility.super.register(ability);
        utils = new Utils(abilityContext);  // 得到实例
        // 注册公共事件
        subscribeCommonEvent();
    }

    @Override
    public void deregister(AceAbility ability) {
        abilityContext = null;
        LocalParticleAbility.super.deregister(ability);

        // 取消订阅
        try {
            CommonEventManager.unsubscribeCommonEvent(subscriber);
        } catch (RemoteException e) {
            HiLog.error(LABEL_LOG, "Exception occurred during unsubscribeCommonEvent invocation.");
        }
    }

    public String startToScanning() {

        latch = new CountDownLatch(1); // 需要同步传递数据
        System.out.println("APP LOG 1 调起系统页面:");
        startQRDecodeAbility();

        try {
            HiLog.info(LABEL_LOG, "等待中");
            System.out.println("APP LOG 等待中");
            latch.await();
        } catch (InterruptedException e) {
            HiLog.info(LABEL_LOG, "等待失败");
            System.out.println("app log 等待失败");
        }
        System.out.println("APP LOG photoUriString" + QRDecode_str);
        return QRDecode_str;
        //callback.reply(photoUriString);
    }


    private void subscribeCommonEvent() {
        if (!isSubscribe) {
            HiLog.info(LABEL_LOG, "订阅开始：");

            //1.构建MatchingSkills对象
            MatchingSkills matchingSkills = new MatchingSkills();
            matchingSkills.addEvent(Intent.ACTION_QUERY_WEATHER); //订阅自定义的公共事件

            //2.构建订阅信息对象
            CommonEventSubscribeInfo subscribeInfo = new CommonEventSubscribeInfo(matchingSkills);

            //3.构建订阅者对象
            subscriber = new MyCommonEventSubscriber(subscribeInfo);

            //4.订阅公共事件的核心动作
            try {
                CommonEventManager.subscribeCommonEvent(subscriber);
                isSubscribe = true;
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        } else {
            HiLog.info(LABEL_LOG, "公共事件不能重复订阅");
        }
    }

    private class MyCommonEventSubscriber extends CommonEventSubscriber {

        public MyCommonEventSubscriber(CommonEventSubscribeInfo subscribeInfo) {
            super(subscribeInfo);
        }

        @Override
        public void onReceiveEvent(CommonEventData commonEventData) {
            HiLog.info(LABEL_LOG, "已接收公共事件");
//            Boolean setImaDataResult = false;
            if (commonEventData.getData() != null) {
                System.out.println("接收到数据：" + commonEventData.getData());
                        if (!commonEventData.getData().equals("fail")) {
//                            Uri uri = Uri.parse(commonEventData.getData());
//                            long l = System.currentTimeMillis();
//                            String fileName = String.valueOf(l);
//                            setImaDataResult = utils.setImaData(uri, fileName);
//                            photoUriString = "internal://app/" + String.valueOf(l) + ".jpg";
//                            HiLog.info(LABEL_LOG, "js 访问图片路径：" + photoUriString);
                              QRDecode_str = commonEventData.getData();
                        }
                latch.countDown();
            } else {
                HiLog.info(LABEL_LOG, "已接收公共事件，但数据为空");
                System.out.println("APP LOG 已接收公共事件，但数据为空");
            }

            // 目前 onReceiveEvent 只能在 ui 主线程上执行
            // 耗时任务派发到子线程异步执行，保证不阻塞 ui 线程
//            final AsyncCommonEventResult result = goAsyncCommonEvent();
//            Boolean finalSetImaDataResult = setImaDataResult;
//            handler.postTask(new Runnable() {
//                @Override
//                public void run() {
//                    if (finalSetImaDataResult) {
//                        HiLog.info(LABEL_LOG, "进行数据库操作");
//                        // 存入数据库
//                    }
//                    HiLog.info(LABEL_LOG, "数据库操作完成");
//                    result.finishCommonEvent();//结束事件
//                }
//            });
        }
    }
}