import Dungeon from "../Dungeon";
import SlimeVenom from "../Boss/SlimeVenom";
import DamageData from "../Data/DamageData";
import StatusManager from "./StatusManager";
import NonPlayer from "../NonPlayer";
import FromData from "../Data/FromData";
import IndexZ from "../Utils/IndexZ";
import AreaOfEffect from "../Actor/AreaOfEffect";
import AreaOfEffectData from "../Data/AreaOfEffectData";

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
    static readonly AFTER_ASH = 'special030';
    @property(cc.Prefab)
    venom: cc.Prefab = null;
    @property(cc.Prefab)
    howl: cc.Prefab = null;
    @property(cc.Prefab)
    claw: cc.Prefab = null;
    @property(cc.Prefab)
    blade: cc.Prefab = null;
    @property(cc.Prefab)
    ash: cc.Prefab = null;
    dungeon: Dungeon;
    clear(): void {
    }
    addPlacement(placeType: string, distance: number, isFaceRight: boolean, from: FromData) {
        if (!this.dungeon) {
            return;
        }
        let pos = this.node.convertToWorldSpaceAR(cc.v3(distance, 0));
        pos = this.dungeon.node.convertToNodeSpaceAR(pos);

        switch (placeType) {
            case SpecialManager.AFTER_VENOM:
                this.addVenom(pos, isFaceRight, from);
                break;
            case SpecialManager.AFTER_CLAW:
                this.addClaw(pos, isFaceRight, from);
                break;
            case SpecialManager.AFTER_BLADE:
                this.addBlade(pos, isFaceRight, from);
                break;
            case SpecialManager.AFTER_ASH:
                this.addAsh(pos, isFaceRight, from);
                break;
        }
    }
    addEffect(placeType: string, distance: number, isFaceRight: boolean, from: FromData) {
        if (!this.dungeon) {
            return;
        }
        let pos = this.node.convertToWorldSpaceAR(cc.v3(distance, 0));
        pos = this.dungeon.node.convertToNodeSpaceAR(pos);

        switch (placeType) {
            case SpecialManager.BEFORE_HOWL:
                this.addHowl(pos, isFaceRight, from);
                break;
        }
    }

    private addVenom(pos: cc.Vec3, isFaceRight: boolean, from: FromData) {
        let venom = cc.instantiate(this.venom);
        venom.getComponent(SlimeVenom).player = this.dungeon.player;
        venom.getComponent(SlimeVenom).isForever = false;
        venom.getComponent(SlimeVenom).from.valueCopy(from);
        venom.parent = this.dungeon.node;
        venom.position = pos;
        venom.zIndex = IndexZ.ACTOR;
        venom.scale = 0;
        venom.runAction(cc.scaleTo(0.5, 2, 2))
    }
    private addHowl(pos: cc.Vec3, isFaceRight: boolean, from: FromData) {
        let monster = this.node.parent.getComponent(NonPlayer);
        if (monster) {
            monster.addStatus(StatusManager.WEREWOLFDEFENCE, from);
        }
        let howl = cc.instantiate(this.howl);
        let howlScript = howl.getComponent(AreaOfEffect);
        howlScript.show(this.dungeon.node, pos, cc.v3(1, 0), 0, new AreaOfEffectData()
            .init(0, 2, 1, 2, IndexZ.getActorZIndex(howl.position), true, false, true, false, false, new DamageData(1), from, [StatusManager.DIZZ]));
    }
    private addClaw(pos: cc.Vec3, isFaceRight: boolean, from: FromData) {
        let claw = cc.instantiate(this.claw);
        pos.y += 32;
        let areaScript = claw.getComponent(AreaOfEffect);
        areaScript.show(this.dungeon.node, pos, cc.v3(1, 0), 0, new AreaOfEffectData()
            .init(0, 0.15, 0.1, 1, IndexZ.getActorZIndex(claw.position), true, false, true, false, false, new DamageData(2), from, [StatusManager.BLEEDING]));
    }
    private addAsh(pos: cc.Vec3, isFaceRight: boolean, from: FromData) {
        let ash = cc.instantiate(this.ash);
        pos.y += 32;
        let areaScript = ash.getComponent(AreaOfEffect);
        areaScript.show(this.dungeon.node, pos, cc.v3(1, 0), 0, new AreaOfEffectData()
            .init(0.3, 0.3, 0.1, 3, IndexZ.getActorZIndex(ash.position), true, true, true, true, false, new DamageData(1), from, [StatusManager.FROZEN]));
    }
    private addBlade(pos: cc.Vec3, isFaceRight: boolean, from: FromData) {
        let prefab = cc.instantiate(this.blade);
        pos.y += 64;
        prefab.scaleX = isFaceRight ? 1 : -1;
        let areaScript = prefab.getComponent(AreaOfEffect);
        areaScript.show(this.dungeon.node, pos, cc.v3(1, 0), 0, new AreaOfEffectData()
            .init(0, 0.2, 0.1, 1, IndexZ.getActorZIndex(prefab.position), true, false, true, false, false, new DamageData(2), from, []));
    }
}
