package com.example.learnmyapplication_ark.slice;

import com.example.learnmyapplication_ark.qrLibrary.QRCodeView;
import ohos.aafwk.ability.AbilitySlice;
import ohos.aafwk.content.Intent;
import ohos.agp.components.ComponentContainer;
import ohos.agp.components.DirectionalLayout;

public class ScanningQRAbilitySlice extends AbilitySlice implements QRCodeView.ScanResultListener {

    private QRCodeView qrCodeView;

    @Override
    protected void onStart(Intent intent) {
        super.onStart(intent);
        addComponent();
    }

    /**
     * 添加扫码布局
     */

    private void addComponent() {
        qrCodeView = new QRCodeView(this);
        DirectionalLayout.LayoutConfig params =
                new DirectionalLayout.LayoutConfig(
                        ComponentContainer.LayoutConfig.MATCH_PARENT,
                        ComponentContainer.LayoutConfig.MATCH_PARENT);
        qrCodeView.setLayoutConfig(params);
        qrCodeView.setScanResultListener(this);

        setUIContent(qrCodeView);

    }

    /**
     * 生命周期.
     */
    @Override
    protected void onStop() {
        super.onStop();
        qrCodeView.onDestroy(); // 销毁二维码扫描控件
    }


    /**
     * Scan result.
     *
     * @param result result
     */
    @Override
    public void  scanResult(String result) {
        Intent intent = new Intent();
        intent.setParam("taskId",result);
        setResult(intent);
        terminate();
    }

}
