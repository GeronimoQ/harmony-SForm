package com.example.learnmyapplication_ark;

import ohos.aafwk.ability.AbilitySliceAnimator;
import ohos.aafwk.ability.DataAbilityHelper;
import ohos.aafwk.content.Intent;
import ohos.aafwk.content.Operation;
import ohos.ace.ability.AceAbility;
import ohos.bundle.IBundleManager;
import ohos.event.commonevent.CommonEventData;
import ohos.event.commonevent.CommonEventManager;
import ohos.event.commonevent.CommonEventPublishInfo;
import ohos.hiviewdfx.HiLog;
import ohos.hiviewdfx.HiLogLabel;
import ohos.media.image.ImageSource;
import ohos.media.photokit.metadata.AVStorage;
import ohos.rpc.RemoteException;
import ohos.security.SystemPermission;
import ohos.utils.net.Uri;

public class MainAbility extends AceAbility {
    private static final HiLogLabel LABEL_LOG = new HiLogLabel(3, 0xD001100, "MainAbility");
    /**
     * request Code.
     */
    private static final int REQUEST_CODE = 20210601;
    private int REQ_CODE=1001;
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
                != IBundleManager.PERMISSION_GRANTED ||verifySelfPermission(SystemPermission.READ_USER_STORAGE)
                != IBundleManager.PERMISSION_GRANTED) {
            // has no permission
            if (canRequestPermission(SystemPermission.CAMERA)||canRequestPermission(SystemPermission.READ_USER_STORAGE)) {
                // toast
                requestPermissionsFromUser(
                        new String[]{SystemPermission.CAMERA,SystemPermission.READ_USER_STORAGE}, REQUEST_CODE);
            }
        }

    }

    @Override
    public void onStop() {
        QrScanningServiceAbility.getINSTANCE().deregister(this);
        super.onStop();
    }


    /*
     * 发布有序的公共事件
     */
    private void orderlyEventPublish(String data,int reqCode) {
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
        commonEventData.setCode(reqCode);

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
        switch(requestCode){
            case 1001:{
                System.out.println("APP LOG resultData：" + resultData.getUriString());
                // 通过发布有序公共事件传递信息
                orderlyEventPublish(resultData.getStringParam("taskId").toString(),1001);
                break;
            }
            case 1002:{
                HiLog.info(LABEL_LOG,"选择图片getUriString:"+resultData.getUriString());

                //选择的Img对应的Uri

                String chooseImgUri=resultData.getUriString();

                HiLog.info(LABEL_LOG,"选择图片getScheme:"+chooseImgUri.substring(chooseImgUri.lastIndexOf('/')));



                //定义数据能力帮助对象
                DataAbilityHelper helper=DataAbilityHelper.creator(getContext());
                //定义图片来源对象

                ImageSource imageSource = null;

                //获取选择的Img对应的Id

                String chooseImgId=null;

                //如果是选择文件则getUriString结果为content://com.android.providers.media.documents/document/image%3A30，其中%3A是":"的URL编码结果，后面的数字就是image对应的Id

                //如果选择的是图库则getUriString结果为content://media/external/images/media/30，最后就是image对应的Id

                //这里需要判断是选择了文件还是图库

                if(chooseImgUri.lastIndexOf("%3A")!=-1){

                    chooseImgId = chooseImgUri.substring(chooseImgUri.lastIndexOf("%3A")+3);

                }

                else {

                    chooseImgId = chooseImgUri.substring(chooseImgUri.lastIndexOf('/')+1);

                }

                //获取图片对应的uri，由于获取到的前缀是content，我们替换成对应的dataability前缀

                Uri uri=Uri.appendEncodedPathToUri(AVStorage.Images.Media.EXTERNAL_DATA_ABILITY_URI,chooseImgId);

                HiLog.info(LABEL_LOG,"选择图片dataability路径:"+uri.toString());

//                StringBuffer base64String=new StringBuffer("data:image/png;base64,");
//                由于传输数据限制在512kb，无法发布订阅，转到LOCALPARTICAL处理
                orderlyEventPublish(uri.toString(),1002);
                try {
                    //读取图片
//                    FileDescriptor fd = helper.openFile(uri, "r");
//                    imageSource = ImageSource.create(fd, null);
//                    //创建位图
//                    PixelMap pixelMap = imageSource.createPixelmap(null);
//                    //设置图片控件对应的位图
//                    ImagePacker imagePacker = ImagePacker.create();
//                    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
//                    ImagePacker.PackingOptions packingOptions = new ImagePacker.PackingOptions();
//                    imagePacker.initializePacking(byteArrayOutputStream, packingOptions);
//                    imagePacker.addImage(pixelMap);
//                    imagePacker.finalizePacking();
//                    byte[] bytes = byteArrayOutputStream.toByteArray();
//                    base64String.append(Base64.getEncoder().encodeToString(bytes));
//                    System.out.println("图片："+base64String.toString());
                } catch (Exception e) {
                    System.out.println("error   1"+e);
                    orderlyEventPublish("fail",1002);
                    e.printStackTrace();

                } finally {
                    if (imageSource != null) {
//                        System.out.println(base64String.toString());
                        imageSource.release();
                    }
                }
            }
        }
        } catch (Exception e) {
            orderlyEventPublish("fail",1001);
            e.printStackTrace();
        }
    }
}
