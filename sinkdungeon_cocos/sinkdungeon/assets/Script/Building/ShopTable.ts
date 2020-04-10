import Player from "../Player";
import Dungeon from "../Dungeon";
import EquipmentManager from "../Manager/EquipmentManager";
import Logic from "../Logic";
import { EventConstant } from "../EventConstant";
import ShopTableData from "../Data/ShopTableData";
import Building from "./Building";

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
export default class ShopTable extends Building {

    // LIFE-CYCLE CALLBACKS:
    static readonly EQUIPMENT = 0;
    static readonly ITEM = 1;
    info: cc.Node;
    label: cc.Label;
    data: ShopTableData = new ShopTableData();


    onLoad() {
        this.info = this.node.getChildByName('info');
        this.label = this.info.getComponentInChildren(cc.Label);
    }

    start() {

    }
    showItem() {
        if (this.node.parent && !this.data.isSaled) {
            let dungeon = this.node.parent.getComponent(Dungeon);
            if (dungeon) {
                if(this.data.shopType == ShopTable.EQUIPMENT){
                    dungeon.addEquipment(Logic.getRandomEquipType(), this.data.pos, this.data.equipdata, 3, this);
                }else if(this.data.shopType == ShopTable.ITEM){
                    dungeon.addItem(Dungeon.getPosInMap(this.data.pos),Logic.getRandomItemType(),this);
                }
            }
        }
    }
    setPos(pos: cc.Vec3) {
        this.data.pos = pos;
        this.node.position = Dungeon.getPosInMap(pos);
        this.node.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - pos.y) * 10 + 1;
    }
    timeDelay = 0;
    update(dt) {
        this.timeDelay += dt;
        if (this.timeDelay > 0.2) {
            this.label.string = `${this.data.price}`;
            this.info.opacity = this.data.isSaled ? 0 : 255;
            let currtables = Logic.mapManager.getCurrentMapShopTables();
            if (currtables) {
                for (let temptable of currtables) {
                    if (temptable.pos.equals(this.data.pos)) {
                        temptable.isSaled = this.data.isSaled;
                        temptable.price = this.data.price;
                    }
                }
            }
        }
    }
    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        let player = other.node.getComponent(Player);
        if (player) {
        }
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let player = other.node.getComponent(Player);
        if (player) {
        }
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        let player = other.node.getComponent(Player);
        if (player) {
        }
    }
}
