import Player from "../Player";
import Dungeon from "../Dungeon";
import Logic from "../Logic";
import Building from "./Building";
import IndexZ from "../utils/IndexZ";
import BuildingData from "../data/BuildingData";

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

    onLoad() {
        this.info = this.node.getChildByName('info');
        this.label = this.info.getComponentInChildren(cc.Label);
    }

    start() {

    }
    showItem() {
        if (!this.node.parent) {
            return;
        }
        if (!this.data.isSaled) {
            let dungeon = this.node.parent.getComponent(Dungeon);
            if (dungeon) {
                let rand4save = Logic.mapManager.getRandom4Save(Logic.mapManager.getRebornSeed(this.seed));
                if (this.data.shopType == ShopTable.EQUIPMENT) {
                    dungeon.addEquipment(Logic.getRandomEquipType(rand4save), Dungeon.getPosInMap(this.data.defaultPos), this.data.equipdata, 3, this);
                } else if (this.data.shopType == ShopTable.ITEM) {
                    dungeon.addItem(Dungeon.getPosInMap(this.data.defaultPos), Logic.getRandomItemType(rand4save), 0, this);
                }
            }
            this.sale(false);
        } else {
            this.sale(true);
        }
    }
    setDefaultPos(defaultPos: cc.Vec3) {
        this.data.defaultPos = defaultPos;
        this.node.position = Dungeon.getPosInMap(defaultPos);
        this.node.zIndex = IndexZ.getActorZIndex(this.node.position);
    }
    public sale(isSaled: boolean) {
        if (!this.info) { this.info = this.node.getChildByName('info'); }
        if (!this.label) { this.label = this.info.getComponentInChildren(cc.Label); }
        this.data.isSaled = isSaled;
        this.label.string = `${this.data.price}`;
        this.info.opacity = this.data.isSaled ? 0 : 255;
        let saveTable = Logic.mapManager.getCurrentMapBuilding(this.data.defaultPos);
        if (saveTable) {
            saveTable.valueCopy(this.data);
        }
    }

    // onCollisionEnter(other: cc.Collider, self: cc.Collider) {
    //     let player = other.node.getComponent(Player);
    //     if (player) {
    //     }
    // }
    // onCollisionExit(other: cc.Collider, self: cc.Collider) {
    //     let player = other.node.getComponent(Player);
    //     if (player) {
    //     }
    // }
}
