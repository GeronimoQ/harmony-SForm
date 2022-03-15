/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.example.learnmyapplication_ark.qrLibrary;

import com.example.learnmyapplication_ark.qrLibrary.core.ScannerCore;
import com.example.learnmyapplication_ark.qrLibrary.util.QRCodeUtil;
import com.google.zxing.*;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.qrcode.QRCodeReader;
import ohos.agp.components.AttrSet;
import ohos.agp.components.ComponentContainer;
import ohos.agp.components.DependentLayout;
import ohos.agp.components.DirectionalLayout;
import ohos.app.Context;
import ohos.eventhandler.EventHandler;
import ohos.eventhandler.EventRunner;
import ohos.media.image.ImageSource;
import ohos.media.image.PixelMap;

import java.util.HashMap;
import java.util.Map;

/**
 * QR View.
 *
 * @since 2021-05-25
 */
public class QRCodeView extends DependentLayout implements com.example.learnmyapplication_ark.qrLibrary.CameraPreview.CameraResultListener {
    /**
     * 相机预览.
     */
    private com.example.learnmyapplication_ark.qrLibrary.CameraPreview cameraPreview;
    /**
     * 扫码框视图.
     */
    private com.example.learnmyapplication_ark.qrLibrary.ScanBoxView scanBoxView;
    /**
     * 识别二维码数据核心类.
     */
    private ScannerCore scannerCore;
    /**
     * 异步线程处理扫码数据结果.
     */
    private EventHandler eventHandler;
    /**
     * 结果呈现.
     */
    private ScanResultListener scanResultListener;

    /**
     * 构造方法.
     *
     * @param context 上下文
     */
    public QRCodeView(Context context) {
        super(context);
        initView(context);
    }

    private Result QRDecodeResult;

    /**
     * 构造方法.
     *
     * @param context 上下文
     * @param attrSet 资源属性
     */
    public QRCodeView(Context context, AttrSet attrSet) {
        super(context, attrSet);
        initView(context);

    }

    /**
     * 初始化工作.
     *
     * @param context 上下文
     */
    private void initView(Context context) {
        // 初始化扫码解析核心类
        scannerCore = new ScannerCore();
        // 添加相机预览视图
        addCameraPreview(context);
        // 添加扫描框视图
        addScanBoxView(context);
        // 初始化异步线程
        eventHandler = new EventHandler(EventRunner.create("QRCodeView"));
    }

    /**
     * 添加扫码框视图.
     *
     * @param context 上下文
     */
    private void addScanBoxView(Context context) {
        scanBoxView = new com.example.learnmyapplication_ark.qrLibrary.ScanBoxView(context);
        DirectionalLayout.LayoutConfig boxParams =
                new DirectionalLayout.LayoutConfig(
                        ComponentContainer.LayoutConfig.MATCH_PARENT,
                        ComponentContainer.LayoutConfig.MATCH_PARENT);
        addComponent(scanBoxView, boxParams);
    }

    /**
     * 添加相机预览视图.
     *
     * @param context 上下文
     */
    private void addCameraPreview(Context context) {
        cameraPreview = new com.example.learnmyapplication_ark.qrLibrary.CameraPreview(context);
        DirectionalLayout.LayoutConfig params =
                new DirectionalLayout.LayoutConfig(
                        ComponentContainer.LayoutConfig.MATCH_PARENT,
                        ComponentContainer.LayoutConfig.MATCH_PARENT);
        cameraPreview.setLayoutConfig(params);
        cameraPreview.setCameraResultListener(this);
        addComponent(cameraPreview);
    }

    /**
     * 打开闪光灯.
     */
    public void openFlashlight() {
        cameraPreview.openFlashlight();
    }

    /**
     * 关闭闪光灯.
     */
    public void closeFlashlight() {
        cameraPreview.closeFlashlight();
    }

    /**
     * 销毁二维码扫描控件.
     */
    public void onDestroy() {
        cameraPreview.stopCameraPreview();
        scanResultListener = null;
        eventHandler = null;
    }

    /**
     * 相机每一帧数据返回.
     *
     * @param data 相机数据
     */
    @Override
    public void cameraResult(byte[] data) {
        if (eventHandler != null) {
            eventHandler.postTask(() -> {
                ImageSource.SourceOptions sourceOptions =
                        new ImageSource.SourceOptions();
                sourceOptions.formatHint = "image/jpg";
                ImageSource imageSource =
                        ImageSource.create(data, sourceOptions);
                PixelMap pixelMap = imageSource.createPixelmap(null);


                Result result = zxingDecode(pixelMap);
                if (result!=null){
                    showResult(result.getText());
                }



            });
        }
    }

    /**
     * 显示结果.
     *
     * @param result 扫码的结果
     */
    private void showResult(String result) {
        if (scanResultListener != null && result != null) {
            if (QRCodeUtil.isEmpty(result)) {
                return;
            }
            getContext().getMainTaskDispatcher().syncDispatch(() -> {
                if (scanResultListener != null) {
                    scanResultListener.scanResult(result);
                }
            });
        }
    }

    /**
     * Scan callback class.
     */
    public interface ScanResultListener {
        /**
         * Scan result.
         *
         * @param result result
         */
        void scanResult(String result);
    }

    /**
     * Set the scanning result.
     *
     * @param scanResultListener 回调事件
     */
    public void setScanResultListener(ScanResultListener scanResultListener) {
        this.scanResultListener = scanResultListener;
    }



    public Result zxingDecode(PixelMap pixelMap){
        int width = pixelMap.getImageInfo().size.width;
        int height = pixelMap.getImageInfo().size.height;

        int[] pis=new int[width * height];

//        HiLog.info(LABEL_LOG,"pix number byte %{public}d,size ==>%{public}s" +
//                        " w %{public}d h %{public}d",
//                pixelMap.getPixelBytesNumber(),
//                pixelMap.getBytesNumberPerRow(),
//                width,height);

        try{

            pixelMap.readPixels(pis,0,width, new ohos.media.image.common.Rect(0,0,width,height));
        }catch(Exception e){
//            HiLog.error(LABEL_LOG,"read Pixels error:%{public}s",e.toString());
            return null;

        }

        RGBLuminanceSource rgbSource = new RGBLuminanceSource(
                pixelMap.getImageInfo().size.width,pixelMap.getImageInfo().size.height,pis);


//        HiLog.info(LABEL_LOG,"source :%{public}s",rgbSource.toString());

        LuminanceSource source = rgbSource.crop(0,0,rgbSource.getWidth(),rgbSource.getHeight());

        BinaryBitmap bMap = new BinaryBitmap(new HybridBinarizer(source));

        final Map<DecodeHintType, Object> hints = new HashMap<>();
        hints.put(DecodeHintType.CHARACTER_SET, "utf-8");
        hints.put(DecodeHintType.POSSIBLE_FORMATS, BarcodeFormat.QR_CODE);
        hints.put(DecodeHintType.TRY_HARDER, Boolean.TRUE);

        QRCodeReader reader=new QRCodeReader();

        Result result = null;
        try{
            result =reader.decode(bMap,hints);
//            HiLog.info(LABEL_LOG,"==>result:"+result.toString());
//            showTips(this.getContext(),result.toString());
            return result;
        }catch (NotFoundException e){
//            HiLog.info(LABEL_LOG,"not found:"+e.toString());
        }catch (Exception e){
//            HiLog.error(LABEL_LOG,"catch Exception:"+e.toString());
        }
        return null;
    }


    public Result getQRDecodeResult(){
        return QRDecodeResult;
    }

}
