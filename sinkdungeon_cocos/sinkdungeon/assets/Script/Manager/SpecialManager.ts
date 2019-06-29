import Dungeon from "../Dungeon";
import SlimeVenom from "../Boss/SlimeVenom";
import Player from "../Player";
import Logic from "../Logic";
import DamageData from "../Data/DamageData";
import { EventConstant } from "../EventConstant";
import StatusManager from "./StatusManager";
import Monster from "../Monster";
import AreaAttack from "../Item/AreaAttack";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
//放置物管理器
const { ccclass, property } = cc._decorator;

@ccclass
export default class SpecialManager extends cc.Component {

    static readonly BEFORE_VENOM = 'special019';
    static readonly AFTER_HOWL = 'special015';
    @property(cc.Prefab)
    venom: cc.Prefab = null;
    @property(cc.Prefab)
    howl: cc.Prefab = null;
    dungeon: Dungeon;

    addPlacement(placeType: string, distance: number) {
        if (!this.dungeon) {
            return;
        }
        let pos = this.node.convertToWorldSpace(cc.v2(distance, 0));
        pos = this.dungeon.node.convertToNodeSpace(pos);

        switch (placeType) {
            case SpecialManager.BEFORE_VENOM:
                this.addVenom(pos);
                break;
        }
    }
    addEffect(placeType: string, distance: number){
        if (!this.dungeon) {
            return;
        }
        let pos = this.node.convertToWorldSpace(cc.v2(distance, 0));
        pos = this.dungeon.node.convertToNodeSpace(pos);

        switch (placeType) {
            case SpecialManager.AFTER_HOWL:
                this.addHowl(pos);
                break;
        }
    }

    private addVenom(pos: cc.Vec2) {
        let venom = cc.instantiate(this.venom);
        venom.getComponent(SlimeVenom).player = this.dungeon.player;
        venom.getComponent(SlimeVenom).isForever = false;
        venom.parent = this.dungeon.node;
        venom.position = pos;
        let indexpos = Dungeon.getIndexInMap(pos);
        venom.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - indexpos.y) * 10;
        venom.scale = 0;
        venom.runAction(cc.scaleTo(0.5, 1, 1))
    }
    private addHowl(pos: cc.Vec2) {
        let howl = cc.instantiate(this.howl);
        howl.parent = this.dungeon.node;
        howl.position = pos;
        let indexpos = Dungeon.getIndexInMap(pos);
        howl.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - indexpos.y) * 10;
        howl.scale = 2;
        let monster = this.node.parent.getComponent(Monster);
        if(monster){
            monster.addStatus(StatusManager.WEREWOLFDEFENCE);
        }
        let howlScript = howl.getComponent(AreaAttack);
        this.schedule(()=>{
            howlScript.damagePlayer(StatusManager.DIZZ,this.dungeon.player);
        },1);
    }
  
}
