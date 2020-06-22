import Player from "../Player";
import Dungeon from "../Dungeon";
import EquipmentManager from "../Manager/EquipmentManager";
import Logic from "../Logic";
import { EventHelper } from "../EventHelper";
import ShopTableData from "../Data/ShopTableData";
import Tips from "../UI/Tips";
import Building from "./Building";
import IndexZ from "../Utils/IndexZ";

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
        this.tips.tipsType = Tips.TAROT_TABLE;
        cc.director.on(EventHelper.PLAYER_TAPTIPS
            , (event) => {
                if (event.detail.tipsType == Tips.TAROT_TABLE) {
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
        this.node.position = Dungeon.getPosInMap(pos);
        this.node.zIndex = IndexZ.getActorZIndex(this.node.position);
    }
    update(dt) {

    }

}
