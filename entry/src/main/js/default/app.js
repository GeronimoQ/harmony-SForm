import createDesigner from './pages/formDesigner/common/designer.js';
import userIAM_userAuth from '@ohos.userIAM.userAuth';
import designer from'./pages/formDesigner/common/designer.js'
export default {
    designer:createDesigner(this),
    onCreate() {
        console.info('AceApplication onCreate');
    },
    onDestroy() {
        console.info('AceApplication onDestroy');

    },



};
