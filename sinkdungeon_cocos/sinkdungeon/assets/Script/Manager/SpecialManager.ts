import Dungeon from "../Dungeon";
import SlimeVenom from "../Boss/SlimeVenom";
import DamageData from "../Data/DamageData";
import StatusManager from "./StatusManager";
import NonPlayer from "../NonPlayer";
import FromData from "../Data/FromData";
import IndexZ from "../Utils/IndexZ";
import AreaOfEffect from "../Actor/AreaOfEffect";
import AreaOfEffectData from "../Data/AreaOfEffectData";
import Logic from "../Logic";
import { EventHelper } from "../EventHelper";
import AudioPlayer from "../Utils/AudioPlayer";

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
    static readonly AFTER_ICE = 'special031';
    static readonly AFTER_DOWN = 'special032';
    static readonly AFTER_SWORD = 'special033';
    @property(cc.Prefab)
    aoe: cc.Prefab = null;
    @property(cc.Prefab)
    venom: cc.Prefab = null;
    @property(cc.Prefab)
    howl: cc.Prefab = null;
    @property(cc.Prefab)
    claw: cc.Prefab = null;
    @property(cc.Prefab)
    blade: cc.Prefab = null;
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
                this.addAoe(pos, new AreaOfEffectData()
                    .init(0.3, 0.3, 0.1, 3, IndexZ.getActorZIndex(this.node.parent.position)
                        , true, true, true, false, false, new DamageData(2), from, [StatusManager.DIZZ])
                    , ['ash001', 'ash002', 'ash003', 'ash004'], false,isFaceRight);
                cc.director.emit(EventHelper.CAMERA_SHAKE, { detail: { isHeavyShaking: true } });
                break;
            case SpecialManager.AFTER_ICE:
                AudioPlayer.play(AudioPlayer.ICEBOOM);
                this.addAoe(pos, new AreaOfEffectData()
                    .init(0.8, 1, 0.2, 2, IndexZ.getActorZIndex(this.node.parent.position)
                        , true, true, true, false, false, new DamageData(3), from, [StatusManager.FROZEN])
                    , ['ice001', 'ice002', 'ice002', 'ice003', 'ice004'], false,isFaceRight);
                cc.director.emit(EventHelper.CAMERA_SHAKE, { detail: { isHeavyShaking: false } });
                break;
            case SpecialManager.AFTER_DOWN:
                this.addAoe(pos, new AreaOfEffectData()
                .init(0.3, 1, 0.1, 1, IndexZ.getActorZIndex(this.node.parent.position)
                    , true, true, true, false, false, new DamageData(1), from, [StatusManager.FALLEN_DOWN])
                , ['ash001', 'ash002', 'ash003', 'ash004'], false,isFaceRight);
            cc.director.emit(EventHelper.CAMERA_SHAKE, { detail: { isHeavyShaking: false } });
            break;
            case SpecialManager.AFTER_SWORD:
                pos.y += 32;
                this.addAoe(pos, new AreaOfEffectData()
                .init(0.4, 0.1, 0, 2, IndexZ.getActorZIndex(this.node.parent.position)
                    , true, true, true, false, false, new DamageData(4), from, [StatusManager.BLEEDING])
                , ['specialswordlight001', 'specialswordlight002', 'specialswordlight003', 'specialswordlight004'], false,isFaceRight);
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
        venom.getComponent(SlimeVenom).target = this.dungeon.player;
        venom.getComponent(SlimeVenom).isForever = false;
        venom.getComponent(SlimeVenom).from.valueCopy(from);
        venom.parent = this.dungeon.node;
        venom.position = pos;
        venom.zIndex = IndexZ.ACTOR;
        venom.scale = 0;
        cc.tween(venom).to(0.5,{scale:2}).start();
    }
    private addHowl(pos: cc.Vec3, isFaceRight: boolean, from: FromData) {
        let monster = this.node.parent.getComponent(NonPlayer);
        if (monster) {
            monster.addStatus(StatusManager.WEREWOLFDEFENCE, from);
        }
        let howl = cc.instantiate(this.howl);
        let howlScript = howl.getComponent(AreaOfEffect);
        howlScript.show(this.dungeon.node, pos, cc.v3(1, 0), 0, new AreaOfEffectData()
            .init(0, 2, 1.5, 2, IndexZ.getActorZIndex(howl.position), true, false, true, false, false, new DamageData(1), from, [StatusManager.DIZZ]));
    }
    private addClaw(pos: cc.Vec3, isFaceRight: boolean, from: FromData) {
        let claw = cc.instantiate(this.claw);
        pos.y += 32;
        let areaScript = claw.getComponent(AreaOfEffect);
        areaScript.show(this.dungeon.node, pos, cc.v3(1, 0), 0, new AreaOfEffectData()
            .init(0, 0.15, 0.1, 1, IndexZ.getActorZIndex(claw.position), true, false, true, false, false, new DamageData(2), from, [StatusManager.BLEEDING]));
    }

    private addAoe(pos: cc.Vec3, aoeData: AreaOfEffectData, spriteFrameNames: string[], repeatForever: boolean,isFaceRight:boolean) {
        let aoe = cc.instantiate(this.aoe);
        pos.y += 32;
        let sprite = aoe.getChildByName('sprite').getComponent(cc.Sprite);
        let collider = aoe.getComponent(cc.BoxCollider);
        if (spriteFrameNames.length > 0) {
            let spriteframe = Logic.spriteFrameRes(spriteFrameNames[0]);
            sprite.node.width = spriteframe.getRect().width;
            sprite.node.height = spriteframe.getRect().height;
            sprite.node.scale = 4;
            sprite.node.scaleX = isFaceRight ? 4 : -4;
            collider.size.width = sprite.node.width * 3;
            collider.size.height = sprite.node.height * 3;
        }
        let tween = cc.tween();
        for (let name of spriteFrameNames) {
            tween.then(cc.tween().delay(0.2).call(() => {
                sprite.spriteFrame = Logic.spriteFrameRes(name);
            }));
        }
        if (repeatForever) {
            cc.tween(aoe).repeatForever(tween).start();
        } else {
            cc.tween(aoe).then(tween).delay(0.2).call(() => {
                sprite.spriteFrame = null;
            }).start();
        }
        let areaScript = aoe.getComponent(AreaOfEffect);
        areaScript.show(this.dungeon.node, pos, cc.v3(1, 0), 0, aoeData);
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
