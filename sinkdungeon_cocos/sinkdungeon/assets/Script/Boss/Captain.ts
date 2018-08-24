import CaptainSword from "./CaptainSword";
import HealthBar from "../HealthBar";
import MonsterData from "../Data/MonsterData";
import Dungeon from "../Dungeon";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Captain extends cc.Component {


    @property(CaptainSword)
    sword: CaptainSword = null;
    healthBar: HealthBar = null;
    // LIFE-CYCLE CALLBACKS:
    data: MonsterData = new MonsterData();
    isDied = false;
    isShow = false;
    pos: cc.Vec2 = cc.v2(0, 0);
    // onLoad () {}

    start () {
        this.changeZIndex();
        if(this.healthBar){
            this.healthBar.refreshHealth(this.data.currentHealth, this.data.maxHealth);
        }
    }
    transportPlayer(x: number, y: number) {
        this.pos.x = x;
        this.pos.y = y;
        this.changeZIndex();
        this.updatePlayerPos();
    }
    changeZIndex() {
        this.node.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - this.pos.y - 1) * 100 + 2;
    }
    updatePlayerPos() {
        this.node.x = this.pos.x * 64 + 32;
        this.node.y = this.pos.y * 64 + 32;
    }
    update (dt) {
        this.healthBar.node.active = !this.isDied;
    }
}
