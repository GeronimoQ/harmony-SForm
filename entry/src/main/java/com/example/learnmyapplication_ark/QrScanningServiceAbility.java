package com.example.learnmyapplication_ark;

import com.example.learnmyapplication_ark.utils.Utils;
import ohos.aafwk.ability.Ability;
import ohos.aafwk.ability.DataAbilityHelper;
import ohos.aafwk.content.Intent;
import ohos.aafwk.content.Operation;
import ohos.ace.ability.AceAbility;
import ohos.ace.ability.LocalParticleAbility;
import ohos.event.commonevent.*;
import ohos.eventhandler.EventHandler;
import ohos.eventhandler.EventRunner;
import ohos.hiviewdfx.HiLog;
import ohos.hiviewdfx.HiLogLabel;
import ohos.media.image.ImagePacker;
import ohos.media.image.ImageSource;
import ohos.media.image.PixelMap;
import ohos.rpc.RemoteException;
import ohos.utils.net.Uri;

import java.io.ByteArrayOutputStream;
import java.io.FileDescriptor;
import java.util.Base64;
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
    private String ImageDecode_str = null;

    private final static int IMG_REQ_CODE = 1002;
    private final static int QR_SCAN_REQ_CODE = 1001;

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
        abilityContext.startAbilityForResult(intent, QR_SCAN_REQ_CODE);
    }

    private void startImageSelectAbility() {
        Intent intent = new Intent();
        Operation operation = new Intent.OperationBuilder()
                .withAction("android.intent.action.GET_CONTENT")
                .build();
        intent.setOperation(operation);
        intent.addFlags(Intent.FLAG_NOT_OHOS_COMPONENT);
        intent.setType("image/*");
        abilityContext.startAbilityForResult(intent, IMG_REQ_CODE);

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


    public String startToSelectImage() {

        latch = new CountDownLatch(1); // 需要同步传递数据
        System.out.println("APP LOG 1 调起系统页面:");
        startImageSelectAbility();

        try {
            HiLog.info(LABEL_LOG, "等待中");
            System.out.println("APP LOG 等待中");
            latch.await();
        } catch (InterruptedException e) {
            HiLog.info(LABEL_LOG, "等待失败");
            System.out.println("app log 等待失败");
        }
        System.out.println("APP LOG photoUriString" + ImageDecode_str);
        return ImageDecode_str;
        //callback.reply(photoUriString);
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
//            用于耗时操作
//            Boolean setImaDataResult = false;
            System.out.println("out!!!!!!!!code:" + commonEventData.getCode() + "---------data：" + commonEventData.getData());
            if (commonEventData.getData() != null) {
//               要求有数据返回的并处理的块
                System.out.println("接收到数据：" + commonEventData.getData());
                System.out.println("!!!!!!!!code:" + commonEventData.getCode() + "---------data：" + commonEventData.getData());
                if (!commonEventData.getData().equals("fail")) {
                    switch (commonEventData.getCode()) {
//                IMG_REQ
                        case IMG_REQ_CODE: {
//                            传的是dataability
                            //                    //读取图片
                            DataAbilityHelper helper = DataAbilityHelper.creator(abilityContext);

                            ImageSource imageSource = null;
                            StringBuffer base64String = new StringBuffer("data:image/png;base64,");
                            try {
                                //读取图片
                                FileDescriptor fd = helper.openFile(Uri.parse(commonEventData.getData()), "r");
                                imageSource = ImageSource.create(fd, null);
                                //创建位图
                                PixelMap pixelMap = imageSource.createPixelmap(null);
                                //设置图片控件对应的位图
                                ImagePacker imagePacker = ImagePacker.create();
                                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                                ImagePacker.PackingOptions packingOptions = new ImagePacker.PackingOptions();
                                imagePacker.initializePacking(byteArrayOutputStream, packingOptions);
                                imagePacker.addImage(pixelMap);
                                imagePacker.finalizePacking();
                                byte[] bytes = byteArrayOutputStream.toByteArray();
                                base64String.append(Base64.getEncoder().encodeToString(bytes));
                                System.out.println("图片：" + base64String.toString());
                            } catch (Exception e) {
                                System.out.println("error   1" + e);
                                e.printStackTrace();

                            } finally {
                                if (imageSource != null) {
//                        System.out.println(base64String.toString());
                                    ImageDecode_str=base64String.toString();
                                    imageSource.release();
                                }
                            }
                            break;
                        }
//                QR_REQ
                        case QR_SCAN_REQ_CODE: {
                            HiLog.info(LABEL_LOG, "已经获得QR数据,REQ_CODE:" + commonEventData.getCode());
                            QRDecode_str = commonEventData.getData();
                            break;
                        }
//                default:
//                    throw new IllegalStateException("Unexpected value: " + commonEventData.getCode());
                    }
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