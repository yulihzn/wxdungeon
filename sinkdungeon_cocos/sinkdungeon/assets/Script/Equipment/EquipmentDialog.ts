import Equipment from "./Equipment";
import Logic from "../Logic";

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
export default class EquipmentDialog extends cc.Component {
    @property(cc.Label)
    nametag: cc.Label = null;
    @property(cc.Label)
    desc: cc.Label = null;
    @property(cc.Label)
    damage: cc.Label = null;
    @property(cc.Label)
    criticalStrikeRate: cc.Label = null;
    @property(cc.Label)
    defence: cc.Label = null;
    @property(cc.Label)
    lifeDrain: cc.Label = null;
    @property(cc.Label)
    moveSpeed: cc.Label = null;
    @property(cc.Label)
    attackSpeed: cc.Label = null;
    @property(cc.Label)
    dodge: cc.Label = null;
    @property(cc.Label)
    health: cc.Label = null;
    alpha = 0;
    showSpeed = 3;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        Logic.setAlias(this.node);
        this.alpha = 0;
        this.node.opacity = 0;
        this.showSpeed = 30;
    }
    refreshDialog(equipment: Equipment) {
        this.nametag.string = equipment.nametag + equipment.equipmetTags + equipment.postfix;
        this.desc.string = equipment.desc;
        this.damage.string = equipment.damageMin + '-' + equipment.damageMax;
        this.attackSpeed.string = equipment.attackSpeed + '%';
        this.moveSpeed.string = equipment.moveSpeed + '%';
        this.dodge.string = equipment.dodge + '%';
        this.lifeDrain.string = equipment.lifeDrain + '%';
        this.health.string = equipment.health + '';
        this.defence.string = equipment.defence + '';
        this.criticalStrikeRate.string = equipment.criticalStrikeRate + '%';
    }
    showDialog() {
        this.showSpeed = 3;
        this.alpha = 255;
    }
    hideDialog() {
        this.showSpeed = 30;
        this.alpha = 0;
    }

    update(dt) {
        this.node.opacity = this.lerp(this.node.opacity, this.alpha, dt * this.showSpeed);
    }
    lerp(a, b, r) {
        return a + (b - a) * r;
    }
}
