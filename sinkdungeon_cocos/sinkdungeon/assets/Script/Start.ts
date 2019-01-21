import Logic from "./Logic";
import WxHelper from "./WxHelper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Start extends cc.Component {

    @property(cc.Node)
    continueButton: cc.Node = null;
    @property(WxHelper)
    wxhelper:WxHelper = null;
    start () {
        cc.view.enableAntiAlias(false)
        // init logic
        if(this.continueButton){
            this.continueButton.active = Logic.profile.hasSaveData;
        }
    }
    startGame(){
        if(this.wxhelper){
            this.wxhelper.CloseDialog();
        }
        Logic.profile.clearData();
        Logic.chapterName = Logic.profile.chapterName;
        Logic.resetData();
        cc.director.loadScene('loading');
    }
    continueGame(){
        if(this.wxhelper){
            this.wxhelper.CloseDialog();
        }
        Logic.chapterName = Logic.profile.chapterName;
        Logic.resetData();
        cc.director.loadScene('loading');
    }
    
}
