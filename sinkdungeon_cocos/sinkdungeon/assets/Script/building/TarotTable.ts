import Dungeon from "../logic/Dungeon";
import Tips from "../ui/Tips";
import Building from "./Building";
import IndexZ from "../utils/IndexZ";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class TarotTable extends Building {

    // LIFE-CYCLE CALLBACKS:
    pos: cc.Vec3;
    anim: cc.Animation;
    tips: Tips;


    onLoad() {
        this.anim = this.getComponent(cc.Animation);
        this.tips = this.node.getChildByName("Tips").getComponent(Tips);
        this.tips.onInteract(()=>{
            if (this.node) {
                this.showCards();
            }
        });
    }

    start() {
    }
    showCards() {
        if(!this.anim){
            this.anim = this.getComponent(cc.Animation);
        }
        this.anim.play();
    }
    setPos(pos: cc.Vec3) {
        this.pos = pos;
        this.entity.Transform.position = Dungeon.getPosInMap(pos);
        this.node.position = this.entity.Transform.position.clone();
        this.node.zIndex = IndexZ.getActorZIndex(this.entity.Transform.position);
    }

}
