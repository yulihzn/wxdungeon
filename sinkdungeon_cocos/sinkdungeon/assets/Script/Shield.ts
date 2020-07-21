import Logic from "./Logic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Shield extends cc.Component {
    
    sprite: cc.Sprite = null;
   
    onLoad() {
        this.init();
    }
    init() {
        this.sprite = this.getComponent(cc.Sprite);
    }
    
    changeRes(resName: string) {
        if (!resName || resName.length < 1) {
            return;
        }
        this.sprite.spriteFrame = Logic.spriteFrames[resName];
    }
}