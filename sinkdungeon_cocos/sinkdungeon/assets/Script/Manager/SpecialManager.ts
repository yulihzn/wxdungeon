import Dungeon from "../Dungeon";
import SlimeVenom from "../Boss/SlimeVenom";
import Player from "../Player";
import Logic from "../Logic";
import DamageData from "../Data/DamageData";
import { EventHelper } from "../EventHelper";
import StatusManager from "./StatusManager";
import Monster from "../Monster";
import AreaAttack from "../Item/AreaAttack";
import FromData from "../Data/FromData";
import IndexZ from "../Utils/IndexZ";

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

    static readonly BEFORE_HOWL = 'special015';
    static readonly AFTER_VENOM = 'special019';
    static readonly AFTER_CLAW = 'special024';
    static readonly AFTER_BLADE = 'special008';
    @property(cc.Prefab)
    venom: cc.Prefab = null;
    @property(cc.Prefab)
    howl: cc.Prefab = null;
    @property(cc.Prefab)
    claw: cc.Prefab = null;
    @property(cc.Prefab)
    blade: cc.Prefab = null;
    dungeon: Dungeon;

    addPlacement(placeType: string, distance: number,isFaceRight:boolean,from:FromData) {
        if (!this.dungeon) {
            return;
        }
        let pos = this.node.convertToWorldSpaceAR(cc.v3(distance, 0));
        pos = this.dungeon.node.convertToNodeSpaceAR(pos);

        switch (placeType) {
            case SpecialManager.AFTER_VENOM:
                this.addVenom(pos,isFaceRight,from);
                break;
            case SpecialManager.AFTER_CLAW:
                this.addClaw(pos,isFaceRight,from);
                break;
            case SpecialManager.AFTER_BLADE:
                this.addBlade(pos,isFaceRight,from);
                break;
        }
    }
    addEffect(placeType: string, distance: number,isFaceRight:boolean,from:FromData) {
        if (!this.dungeon) {
            return;
        }
        let pos = this.node.convertToWorldSpaceAR(cc.v3(distance, 0));
        pos = this.dungeon.node.convertToNodeSpaceAR(pos);

        switch (placeType) {
            case SpecialManager.BEFORE_HOWL:
                this.addHowl(pos,isFaceRight,from);
                break;
        }
    }

    private addVenom(pos: cc.Vec3,isFaceRight:boolean,from:FromData) {
        let venom = cc.instantiate(this.venom);
        venom.getComponent(SlimeVenom).player = this.dungeon.player;
        venom.getComponent(SlimeVenom).isForever = false;
        venom.getComponent(SlimeVenom).from.valueCopy(from);
        venom.parent = this.dungeon.node;
        venom.position = pos;
        venom.zIndex = IndexZ.getActorZIndex(venom.position);
        venom.scale = 0;
        venom.runAction(cc.scaleTo(0.5, 2, 2))
    }
    private addHowl(pos: cc.Vec3,isFaceRight:boolean,from:FromData) {
        let howl = cc.instantiate(this.howl);
        howl.parent = this.dungeon.node;
        howl.position = pos;
        howl.zIndex = IndexZ.getActorZIndex(howl.position);
        howl.scale = 2;
        let monster = this.node.parent.getComponent(Monster);
        if (monster) {
            monster.addStatus(StatusManager.WEREWOLFDEFENCE,from);
        }
        let howlScript = howl.getComponent(AreaAttack);
        this.scheduleOnce(() => {
            howlScript.damagePlayer(StatusManager.DIZZ, this.dungeon.player, new DamageData(1),from);
        }, 1);
    }
    private addClaw(pos: cc.Vec3,isFaceRight:boolean,from:FromData) {
        let claw = cc.instantiate(this.claw);
        claw.parent = this.dungeon.node;
        pos.y += 32;
        claw.position = pos;
        claw.zIndex = IndexZ.getActorZIndex(claw.position);
        claw.scale = 1;
        let areaScript = claw.getComponent(AreaAttack);
        this.scheduleOnce(() => {
            areaScript.damagePlayer(StatusManager.BLEEDING, this.dungeon.player, new DamageData(2),from);
            this.scheduleOnce(() => {
                areaScript.damagePlayer(StatusManager.BLEEDING, this.dungeon.player, new DamageData(3),from);
            }, 0.2);
        }, 0.5);
    }
    
    private addBlade(pos: cc.Vec3,isFaceRight:boolean,from:FromData) {
        let prefab = cc.instantiate(this.blade);
        prefab.parent = this.dungeon.node;
        prefab.position = pos;
        pos.y += 64;
        prefab.zIndex = IndexZ.getActorZIndex(prefab.position);
        prefab.scaleX = isFaceRight?1:-1;
        let areaScript = prefab.getComponent(AreaAttack);
        this.scheduleOnce(() => {
            areaScript.damagePlayer('', this.dungeon.player, new DamageData(3),from);
        }, 0.5);
    }
}
