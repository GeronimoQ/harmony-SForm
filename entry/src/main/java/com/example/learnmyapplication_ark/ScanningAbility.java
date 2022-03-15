package com.example.learnmyapplication_ark;

import ohos.aafwk.content.Intent;
import ohos.ace.ability.AceAbility;
import ohos.agp.components.Button;
import ohos.agp.components.Component;
import ohos.agp.components.ComponentContainer;
import ohos.agp.components.DirectionalLayout;
import ohos.agp.components.surfaceprovider.SurfaceProvider;
import ohos.agp.graphics.Surface;
import ohos.agp.window.dialog.CommonDialog;
import ohos.agp.window.dialog.IDialog;
import ohos.agp.window.dialog.ToastDialog;
import ohos.agp.window.service.Window;
import ohos.agp.window.service.WindowManager;
import ohos.bundle.IBundleManager;
import ohos.eventhandler.EventHandler;
import ohos.eventhandler.EventRunner;
import ohos.hiviewdfx.HiLog;
import ohos.hiviewdfx.HiLogLabel;
import ohos.media.camera.CameraKit;
import ohos.media.camera.device.Camera;
import ohos.media.camera.device.CameraConfig;
import ohos.media.camera.device.CameraInfo;
import ohos.media.camera.device.CameraStateCallback;
import ohos.media.recorder.Recorder;
import ohos.security.SystemPermission;

import java.util.Arrays;
import java.util.Optional;

public class ScanningAbility extends AceAbility {

    private static final String TAG = ScanningAbility.class.getName();

    private static final HiLogLabel LABEL_LOG = new HiLogLabel(3, 0xD000F00, TAG);

    private static final int SCREEN_WIDTH = 1080;

    private static final int SCREEN_HEIGHT = 1920;

    private SurfaceProvider surfaceProvider;

    private Surface recorderSurface;

    private Surface previewSurface;

    private boolean isFrontCamera;

    private Camera cameraDevice;

    private Component buttonGroupLayout;

    private Recorder mediaRecorder;

    private ComponentContainer surfaceContainer;

    private CameraConfig.Builder cameraConfigBuilder;

    private boolean isRecording;

    private String videoPath = "";

    private final Object lock = new Object();

    private final EventHandler eventHandler = new EventHandler(EventRunner.current()) {
    };


    private void requestPermission() {
        String[] permissions = {
                SystemPermission.CAMERA,
        };
        if (verifySelfPermission("ohos.permission.CAMERA") != IBundleManager.PERMISSION_GRANTED) {
            System.out.println("!!!!!!!!!!!!!!!!!应用未被授予权限!!!!!!!!!!!!!!!!!!!");
            // 应用未被授予权限
            if (canRequestPermission("ohos.permission.CAMERA")) {
                // 是否可以申请弹框授权(首次申请或者用户未选择禁止且不再提示)
                requestPermissionsFromUser(
                        Arrays.stream(permissions)
                                .filter(permission -> verifySelfPermission(permission) != IBundleManager.PERMISSION_GRANTED).toArray(String[]::new), 0);
            } else {
                System.out.println("!!!!!!!!!!!!!!!!!请求授予权限!!!!!!!!!!!!!!!!!!!");
                new ToastDialog(getContext()).setText("请设置权限").show();
                // 显示应用需要权限的理由，提示用户进入设置授权
                CommonDialog commonDialog = new CommonDialog(getContext());
                commonDialog.setTitleText("权限被禁用");
                commonDialog.setContentText("请到设置中允许相机权限");
                commonDialog.setButton(IDialog.BUTTON3, "确定", (iDialog, i) -> iDialog.destroy());
                commonDialog.show();
            }
        } else {
            // 权限已被授予
            new ToastDialog(getContext()).setText("权限已有").show();
        }
    }


    private void initComponent() {
        surfaceContainer = (ComponentContainer) new DirectionalLayout(this);
        Window window = getWindow();

        Optional<WindowManager.LayoutConfig> layoutConfig = window.getLayoutConfig();
        Arrays.asList(layoutConfig).forEach(config->{
            System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            WindowManager.LayoutConfig layoutConfig1 = config.get();

            System.out.println(layoutConfig1.title);
        });
        Button button = new Button(this);
        button.setText("test");
        surfaceContainer.addComponent(button);
    }

    @Override
    public void onRequestPermissionsFromUserResult(int requestCode, String[] permissions, int[] grantResults) {
        if (permissions == null || permissions.length == 0 || grantResults == null || grantResults.length == 0) {
            new ToastDialog(getContext()).setText("需要扫描二维码获取任务").show();
        }
        for (int grantResult : grantResults) {
            if (grantResult != IBundleManager.PERMISSION_GRANTED) {
                terminateAbility();
                break;
            }
        }
    }

    @Override
    public void onStart(Intent intent) {
        setInstanceName("Scanning");
        super.onStart(intent);
        requestPermission();
    }

    @Override
    public void onForeground(Intent intent) {

        super.onForeground(intent);
    }

    @Override
    public void onActive() {
        super.onActive();
    }

    private void openCamera() {
        CameraKit cameraKit = CameraKit.getInstance(getApplicationContext());
        String[] cameraList = cameraKit.getCameraIds();
        String cameraId = "";
        for (String logicalCameraId : cameraList) {
            int faceType = cameraKit.getCameraInfo(logicalCameraId).getFacingType();
            switch (faceType) {
                case CameraInfo.FacingType.CAMERA_FACING_FRONT:
                    if (isFrontCamera) {
                        cameraId = logicalCameraId;
                    }
                    break;
                case CameraInfo.FacingType.CAMERA_FACING_BACK:
                    if (!isFrontCamera) {
                        cameraId = logicalCameraId;
                    }
                    break;
                case CameraInfo.FacingType.CAMERA_FACING_OTHERS:
                default:
                    break;
            }
        }
        if (cameraId != null && !cameraId.isEmpty()) {
            CameraStateCallbackImpl cameraStateCallback = new CameraStateCallbackImpl();
            cameraKit.createCamera(cameraId, cameraStateCallback, eventHandler);
        }
    }


    private class CameraStateCallbackImpl extends CameraStateCallback {
        CameraStateCallbackImpl() {
        }

        @Override
        public void onCreated(Camera camera) {
            if (surfaceProvider.getSurfaceOps().isPresent()) {
                previewSurface = surfaceProvider.getSurfaceOps().get().getSurface();
            }
            if (previewSurface == null) {
                HiLog.error(LABEL_LOG, "%{public}s", "Create camera filed, preview surface is null");
                return;
            }
            cameraConfigBuilder = camera.getCameraConfigBuilder();
            cameraConfigBuilder.addSurface(previewSurface);
            camera.configure(cameraConfigBuilder.build());
            cameraDevice = camera;
//            updateComponentVisible(true);
        }


//        @Override
//        public void onConfigured(Camera camera) {
//            FrameConfig.Builder frameConfigBuilder = camera.getFrameConfigBuilder(FRAME_CONFIG_PREVIEW);
//            frameConfigBuilder.addSurface(previewSurface);
//            if (isRecording && recorderSurface != null) {
//                frameConfigBuilder.addSurface(recorderSurface);
//            }
//            camera.triggerLoopingCapture(frameConfigBuilder.build());
//            if (isRecording) {
//                eventHandler.postTask(() -> mediaRecorder.start());
//            }
//        }
    }

    private void initSurface() {
        getWindow().setTransparent(true);
        DirectionalLayout.LayoutConfig params = new DirectionalLayout.LayoutConfig(
                ComponentContainer.LayoutConfig.MATCH_PARENT, ComponentContainer.LayoutConfig.MATCH_PARENT);
        surfaceProvider = new SurfaceProvider(this);
        surfaceProvider.setLayoutConfig(params);
        surfaceProvider.pinToZTop(false);
        if (surfaceProvider.getSurfaceOps().isPresent()) {
//            surfaceProvider.getSurfaceOps().get().addCallback(new SurfaceCallBack());
        }
        surfaceContainer.addComponent(surfaceProvider);
    }

}
