import Logic from "./Logic";
import WxHelper from "./WxHelper";
import { EventHelper } from "./EventHelper";
import AudioPlayer from "./Utils/AudioPlayer";
import WorldLoader from "./Map/WorldLoader";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Start extends cc.Component {

    @property(cc.Node)
    continueButton: cc.Node = null;
    @property(WxHelper)
    wxhelper:WxHelper = null;
    @property(cc.Node)
    cheatButton:cc.Node = null;
    @property(cc.Node)
    debugButton:cc.Node = null;
    cheatClickCount = 0;
    debugClickCount = 0;
    start () {
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
        AudioPlayer.play(AudioPlayer.SELECT);
        cc.director.loadScene('loading');
    }
    chooseChapter(){
        AudioPlayer.play(AudioPlayer.SELECT);
        cc.director.loadScene('chapter');
    }
    achievementScene(){
        AudioPlayer.play(AudioPlayer.SELECT);
        cc.director.loadScene('achievement');
    }
    continueGame(){
        if(this.wxhelper){
            this.wxhelper.CloseDialog();
        }
        Logic.resetData();
        AudioPlayer.play(AudioPlayer.SELECT);
        cc.director.loadScene('loading');
    }
    cheatModeChange(){
        if(!this.cheatButton){
            return;
        }
        this.cheatClickCount++;
        if(this.cheatClickCount>2){
            this.cheatClickCount = 0;
            Logic.isCheatMode = true;
            this.cheatButton.opacity = Logic.isCheatMode?255:0;
        }else{
            Logic.isCheatMode = false;
            this.cheatButton.opacity = 0;
        }
    }
    debugModeChange(){
        if(!this.debugButton){
            return;
        }
        this.debugClickCount++;
        if(this.debugClickCount>2){
            this.debugClickCount = 0;
            Logic.isDebug = true;
            this.debugButton.opacity = Logic.isDebug?255:0;
            cc.director.getCollisionManager().enabledDebugDraw = true;
        }else{
            Logic.isDebug = false;
            this.debugButton.opacity = 0;
            cc.director.getCollisionManager().enabledDebugDraw = false;
            
        }
    }
    loadTest(){
        // cc.director.loadScene('chunktest');
    }
    
}
