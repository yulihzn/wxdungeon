import Logic from "./Logic";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Start extends cc.Component {

    @property(cc.Node)
    continueButton: cc.Node = null;

    start () {
        cc.view.enableAntiAlias(false)
        // init logic
        if(this.continueButton){
            this.continueButton.active = Logic.profile.hasSaveData;
        }
    }
    startGame(){
        Logic.profile.clearData();
        cc.director.loadScene('chapter');
    }
    continueGame(){
        cc.director.loadScene('chapter');
    }
}
