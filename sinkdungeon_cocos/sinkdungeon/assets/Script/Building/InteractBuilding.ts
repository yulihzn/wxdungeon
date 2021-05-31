import Dungeon from "../Dungeon";
import Logic from "../Logic";
import Building from "./Building";
import { EventHelper } from "../EventHelper";
import AudioPlayer from "../Utils/AudioPlayer";
import Item from "../Item/Item";
import IndexZ from "../Utils/IndexZ";
import DamageData from "../Data/DamageData";
import Player from "../Player";
import { ColliderTag } from "../Actor/ColliderTag";
import Boss from "../Boss/Boss";
import AvatarData from "../Data/AvatarData";
import CommonData from "../Data/CommonData";
import MeleeWeapon from "../MeleeWeapon";
import NonPlayer from "../NonPlayer";
import Box from "./Box";
import HitBuilding from "./HitBuilding";

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
export default class InteractBuilding extends Building {

    static readonly BOX = 0;
    static readonly PLANT = 1;
    static readonly BOXBREAKABLE = 2;
    // LIFE-CYCLE CALLBACKS:
    private timeDelay = 0;
    decorateType = 0;
    resName = "decorate000";
    sprite: cc.Sprite;
    shadow: cc.Node;
    mat: cc.MaterialVariant;
    isTaken = false;
    isAttacking = false;
    player: Player;
    isLift = false;
    onLoad() {
        this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
        this.shadow = this.node.getChildByName('shadow');
    }
    start() {

    }
    init(isInteract: boolean, decorateType: number) {
        this.decorateType = decorateType;
        this.data.interact = isInteract ? 1 : 0;
        switch (Logic.chapterIndex) {
            case Logic.CHAPTER00: this.resName = `decorate000${this.decorateType}`; break;
            case Logic.CHAPTER01: this.resName = `decorate010${this.decorateType}`; break;
            case Logic.CHAPTER02: this.resName = `decorate020${this.decorateType}`; break;
            case Logic.CHAPTER03: this.resName = `decorate030${this.decorateType}`; break;
            case Logic.CHAPTER04: this.resName = `decorate040${this.decorateType}`; break;
            case Logic.CHAPTER05: this.resName = `decorate040${this.decorateType}`; break;
            case Logic.CHAPTER099: this.resName = `decorate000${this.decorateType}`; break;
        }
        this.updateCollider();
        this.changeRes(this.resName);
    }
    updateCollider() {
        let spriteFrame = Logic.spriteFrameRes(this.resName);
        let width = spriteFrame.getRect().width * this.sprite.node.scale;
        let height = spriteFrame.getRect().height * this.sprite.node.scale / 4;
        let physicCollider = this.getComponent(cc.PhysicsBoxCollider);
        let collider = this.getComponent(cc.BoxCollider);
        if (this.sprite.node.angle == 0) {
            physicCollider.size = cc.size(width, height);
            collider.size = cc.size(width, height);
        } else {
            physicCollider.size = cc.size(height, width);
            collider.size = cc.size(height, width);

        }
        physicCollider.sensor = this.data.currentHealth <= 0 ? true : false;
        physicCollider.apply();
    }
    changeRes(resName: string, suffix?: string) {
        if (!this.sprite) {
            this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
        }
        let spriteFrame = Logic.spriteFrameRes(resName);
        if (suffix && Logic.spriteFrameRes(resName + suffix)) {
            spriteFrame = Logic.spriteFrameRes(resName + suffix);
        }
        this.sprite.node.opacity = 255;
        this.sprite.spriteFrame = spriteFrame;
        if (!this.mat) {
            this.mat = this.node.getChildByName('sprite').getComponent(cc.Sprite).getMaterial(0);
        }
        this.mat.setProperty('textureSizeWidth', spriteFrame.getTexture().width * this.sprite.node.scaleX);
        this.mat.setProperty('textureSizeHeight', spriteFrame.getTexture().height * this.sprite.node.scaleY);
        this.mat.setProperty('outlineColor', cc.Color.WHITE);
        this.sprite.node.angle = this.data.rollover > 0 ? 90 : 0;
    }

    //Animation
    BreakingFinish() {
        this.reset();
    }
    hitLight(isHit: boolean) {
        if (!this.mat) {
            this.mat = this.node.getChildByName('sprite').getComponent(cc.Sprite).getMaterial(0);
        }
        this.mat.setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT);
    }
    highLight(isHigh: boolean) {
        if (!this.mat) {
            this.mat = this.node.getChildByName('sprite').getComponent(cc.Sprite).getMaterial(0);
        }
        this.mat.setProperty('openOutline', isHigh ? 1 : 0);
    }
    takeDamage(damage: DamageData): boolean {
        if (this.data.currentHealth <= 0) {
            return;
        }
        this.data.currentHealth -= damage.getTotalDamage();
        AudioPlayer.play(AudioPlayer.MONSTER_HIT);
        if (this.data.currentHealth > 0) {
            this.hitLight(true);
            this.scheduleOnce(() => {
                this.hitLight(false);
            }, 0.1)
            return true;
        }
        this.isTaken = false;
        cc.tween(this.sprite.node)
            .call(() => {
                this.changeRes(this.resName, 'anim001');
                this.hitLight(true);
            }).delay(0.1).call(() => {
                this.hitLight(false);
                this.changeRes(this.resName, 'anim002');
            }).delay(0.1).call(() => {
                this.changeRes(this.resName, 'anim003');
            }).delay(0.1).call(() => {
                this.changeRes(this.resName, 'anim004');
                this.updateCollider();
                let rand4save = Logic.mapManager.getRandom4Save(Logic.mapManager.getRebornSeed(this.seed));
                let rand = rand4save.rand();
                if (rand > 0.6 && rand < 0.8) {
                    cc.director.emit(EventHelper.DUNGEON_ADD_COIN, { detail: { pos: this.node.position, count: rand4save.getRandomNum(1, 3) } });
                    if (rand4save.getHalfChance()) {
                        cc.director.emit(EventHelper.DUNGEON_ADD_OILGOLD, { detail: { pos: this.node.position, count: rand4save.getRandomNum(1, 10) } });
                    }
                } else if (rand >= 0.8 && rand < 0.85) {
                    cc.director.emit(EventHelper.DUNGEON_ADD_ITEM, { detail: { pos: this.node.position, res: Item.HEART } });
                } else if (rand >= 0.85 && rand < 0.9) {
                    cc.director.emit(EventHelper.DUNGEON_ADD_ITEM, { detail: { pos: this.node.position, res: Item.DREAM } });
                }
            }).delay(10).call(() => {
                this.reset();
            }).start();
        return true;
    }

    reset() {
        this.node.position = Dungeon.getPosInMap(cc.v3(-10, -10));
        this.data.currentHealth = this.data.maxHealth;
    }
    rollover() {
        this.data.rollover = this.data.rollover > 0 ? 0 : 1;
        cc.tween(this.sprite.node).to(0.5, { angle: this.data.rollover > 0 ? 90 : 0 }, { easing: 'bounceOut' }).start();
        this.updateCollider();
    }
    interact(player: Player, isLongPress: boolean, isAttack: boolean, isRemote: boolean): boolean {
        if (this.data.interact < 1) {
            return false;
        }
        this.player = player;
        if (isAttack) {
            return this._attack();
        } else if (isRemote) {
            return this.throwOrKick();
        } else if (isLongPress) {
            return this.putDown();
        } else {
            return this.switchMode();
        }
        return false;
    }
    taken(player: Player, isLongPress: boolean): boolean {
        if (this.data.interact < 1) {
            return;
        }
        this.player = player;
        if (this.isTaken) {
            return false;
        }
        if (isLongPress) {
            this._taken();
            return true;
        } else {
            this.rollover();
            return false;
        }

    }
    //拿起
    private _taken(): boolean {
        this.isTaken = true;
        this.isLift = false;
        return true;
    }
    //放下
    private putDown(): boolean {
        this.isTaken = false;
        return true;
    }
    //模式切换
    private switchMode(): boolean {
        this.isLift = !this.isLift;
        return true;
    }
    //投掷
    private throwOrKick(): boolean {
        this.isTaken = false;
        this.isAttacking = true;
        let rigidBody: cc.RigidBody = this.getComponent(cc.RigidBody);
        let pos = this.player.weaponLeft.meleeWeapon.Hv.clone();
        let power = 1000;
        pos = pos.normalizeSelf().mul(power);
        rigidBody.applyLinearImpulse(cc.v2(pos.x, pos.y), rigidBody.getLocalCenter(), true);
        if (this.isLift) {
            cc.tween(this.sprite.node)
                .to(0.5, { position: cc.v3(0, 128) }, { easing: 'quadOut' })
                .to(0.5, { position: cc.v3(0, 0) }, { easing: 'bounceOut' }).start();
            cc.tween(this.shadow).to(0.5, { scale: 3 }).to(0.5, { scale: 4 }).start();
        }
        this.scheduleOnce(() => {
            this.isAttacking = false;
        }, 1)
        return true;

    }
    //攻击
    private _attack(): boolean {
        if (!this.isTaken || this.isAttacking || !this.player) {
            return false;
        }
        this.isAttacking = true;
        if (this.isLift) {
            let p = this.player.weaponLeft.meleeWeapon.Hv.clone().mul(64);
            cc.tween(this.sprite.node).to(0.2, { position: p }).to(0.6, { position: cc.v3(0, 96) })
                .call(() => {
                    this.isAttacking = false;
                    this.player.weaponLeft.meleeWeapon.MeleeAttackFinish();
                }).start();
        } else {
            cc.tween(this.sprite.node).to(0.3, { position: cc.v3(0, 96) }).to(0.2, { position: cc.v3(0, 0) })
                .call(() => {
                    this.isAttacking = false;
                    this.player.weaponLeft.meleeWeapon.MeleeAttackFinish();
                }).start();
        }
        return true;
    }
    onCollisionStay(other: cc.Collider, self: cc.CircleCollider) {
        if (other.tag != ColliderTag.PLAYER && this.player && this.isTaken) {
            let success = this.player.weaponLeft.meleeWeapon.checkAttacking(other);
            if (success) {
                this.isAttacking = false;
                this.sprite.node.pauseAllActions();
                cc.director.emit(EventHelper.CAMERA_SHAKE, { detail: { isHeavyShaking: false } });
                this.scheduleOnce(() => { this.sprite.node.resumeAllActions() }, 0.1);
            }
        }
    }
    private updatePosition() {
        this.shadow.opacity = 255;
        if (this.player && this.isTaken && !this.isAttacking) {
            if (!this.shadow) {
                this.shadow = this.node.getChildByName('shadow');
            }
            this.shadow.opacity = 0;
            if (this.isLift) {
                let pos = this.player.node.position.add(cc.v3(0, 96));
                this.node.position = Logic.lerpPos(this.node.position, pos, 0.1);
            } else {
                let p = this.player.weaponLeft.meleeWeapon.Hv.clone().mul(64);
                let pos = this.player.node.position.add(p);
                this.node.position = Logic.lerpPos(this.node.position, pos, 0.1);
            }

        }
        this.node.zIndex = IndexZ.getActorZIndex(this.node.position);
    }
    isTimeDelay(dt: number): boolean {
        this.timeDelay += dt;
        if (this.timeDelay > 0.016) {
            this.timeDelay = 0;
            return true;
        }
        return false;
    }
    saveTimeDelay = 0;
    isSaveTimeDelay(dt: number): boolean {
        this.saveTimeDelay += dt;
        if (this.saveTimeDelay > 0.2) {
            this.saveTimeDelay = 0;
            return true;
        }
        return false;
    }
    update(dt) {
        if (this.isTimeDelay(dt)) {
            this.updatePosition();
        }
        if (this.isSaveTimeDelay(dt)) {
            this.data.position = this.node.position;
            let saveDecorate = Logic.mapManager.getCurrentMapBuilding(this.data.defaultPos);
            if (saveDecorate) {
                saveDecorate.valueCopy(this.data);
            }
        }
    }
}
