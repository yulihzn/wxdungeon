import Logic from "./Logic";
import AudioPlayer from "./Utils/AudioPlayer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Start extends cc.Component {

    @property(cc.Node)
    continueButton: cc.Node = null;
    @property(cc.Node)
    cheatButton:cc.Node = null;
    @property(cc.Node)
    debugButton:cc.Node = null;
    @property(cc.Node)
    tourButton:cc.Node = null;
    cheatClickCount = 0;
    debugClickCount = 0;
    tourClickCount = 0;
    start () {
        // init logic
        if(this.continueButton){
            this.continueButton.active = Logic.profileManager.hasSaveData;
        }
    }
    startGame(){
        // //清除存档
        // Logic.profileManager.clearData();
        // //重置数据
        // Logic.resetData();
        // //加载资源
        AudioPlayer.play(AudioPlayer.SELECT);
        // cc.director.loadScene('loading');
        //进入选择页面
        cc.director.loadScene('pickavatar');
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
      
        Logic.resetData();
        Logic.isFirst = 1;
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
            // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
            // cc.PhysicsManager.DrawBits.e_jointBit |
            // cc.PhysicsManager.DrawBits.e_shapeBit;
        }else{
            Logic.isDebug = false;
            this.debugButton.opacity = 0;
            cc.director.getCollisionManager().enabledDebugDraw = false;
            // cc.director.getPhysicsManager().debugDrawFlags = -1;
            
        }
    }
    tourChange(){
        if(!this.tourButton){
            return;
        }
        this.cheatClickCount++;
        if(this.cheatClickCount>2){
            this.cheatClickCount = 0;
            Logic.isTour = true;
            this.tourButton.opacity = Logic.isTour?255:0;
        }else{
            Logic.isTour = false;
            this.tourButton.opacity = 0;
        }
    }

    goTest(){
        cc.director.loadScene('test');
    }
    
}
