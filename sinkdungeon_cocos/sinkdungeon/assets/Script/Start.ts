import Logic from "./Logic";
import WxHelper from "./WxHelper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Start extends cc.Component {

    @property(cc.Node)
    continueButton: cc.Node = null;
    @property(WxHelper)
    wxhelper:WxHelper = null;
    @property(cc.Node)
    cheatButton:cc.Node = null;
    cheatClickCount = 0;
    start () {
        cc.view.enableAntiAlias(false)
        // init logic
        if(this.continueButton){
            this.continueButton.active = Logic.profileManager.hasSaveData;
        }
    }
    startGame(){
        if(this.wxhelper){
            this.wxhelper.CloseDialog();
        }
        //清除存档
        Logic.profileManager.clearData();
        //重置数据
        Logic.resetData();
        //加载资源
        cc.director.loadScene('loading');
    }
    chooseChapter(){
        cc.director.loadScene('chapter');
    }
    achievementScene(){
        cc.director.loadScene('achievement');
    }
    continueGame(){
        if(this.wxhelper){
            this.wxhelper.CloseDialog();
        }
        Logic.resetData();
        cc.director.loadScene('loading');
    }
    cheatModeChange(){
        if(!this.cheatButton){
            return;
        }
        this.cheatClickCount++;
        if(this.cheatClickCount>3){
            this.cheatClickCount = 0;
            Logic.isCheatMode = true;
            this.cheatButton.opacity = Logic.isCheatMode?255:0;
        }else{
            Logic.isCheatMode = false;
            this.cheatButton.opacity = 0;
        }
    }
    
}
