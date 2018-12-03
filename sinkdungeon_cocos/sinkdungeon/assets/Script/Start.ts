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
        cc.director.loadScene('chapter');
    }
    continueGame(){
        if(this.wxhelper){
            this.wxhelper.CloseDialog();
        }
        cc.director.loadScene('chapter');
    }
    
}
