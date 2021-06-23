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
import Actor from "../Base/Actor";
import Boss from "../Boss/Boss";
import AvatarData from "../Data/AvatarData";
import CommonData from "../Data/CommonData";
import FromData from "../Data/FromData";
import StatusManager from "../Manager/StatusManager";
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
    isThrowing = false;
    player: Player;
    isLift = false;
    isAniming = false;
    private hasTargetMap: { [key: string]: number } = {};
    private rigidBody:cc.RigidBody
    onLoad() {
        this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
        this.shadow = this.node.getChildByName('shadow');
        this.rigidBody = this.getComponent(cc.RigidBody);
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
        let offset = 5;
        let physicCollider = this.getComponent(cc.PhysicsBoxCollider);
        let collider = this.getComponent(cc.BoxCollider);
        if (this.sprite.node.angle == 0) {
            physicCollider.size = cc.size(width, height);
            collider.size = cc.size(width + offset, height + offset);
        } else {
            physicCollider.size = cc.size(height, width);
            collider.size = cc.size(height + offset, width + offset);

        }
        physicCollider.density = this.isThrowing ? 1 : 300;
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
        if (this.data.interact < 1 || this.isAniming) {
            return false;
        }
        this.player = player;
        if (isAttack) {
            return this.attack();
        } else if (isRemote) {
            return this.throwOrKick();
        } else if (isLongPress) {
            return this.putDown();
        } else {
            return this.switchMode();
        }
    }
    taken(player: Player, isLongPress: boolean): boolean {
        if (this.data.interact < 1 || this.isAniming) {
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
        if (this.isAniming) {
            return;
        }
        this.isTaken = true;
        this.isLift = true;
        return true;
    }
    //放下
    private putDown(): boolean {
        if (this.isAniming) {
            return;
        }
        this.isTaken = false;
        return true;
    }
    //模式切换
    private switchMode(): boolean {
        if (this.isAniming) {
            return;
        }
        this.isLift = !this.isLift;
        return true;
    }
    //投掷
    private throwOrKick(): boolean {
        if (this.isAniming || this.isThrowing) {
            return;
        }
        this.isAttacking = true;
        this.isThrowing = true;
        this.isAniming = true;
        AudioPlayer.play(AudioPlayer.MELEE);
        this.updateCollider();
        this.beatBack(this.node, this.player.Hv.clone(), this.isLift ? 2000 : 3000);
        this.scheduleOnce(()=>{
            cc.director.emit(EventHelper.CAMERA_SHAKE, { detail: { isHeavyShaking: false } });
        },this.isLift?0.5:0)
        if (this.isLift) {
            cc.tween(this.sprite.node)
                .to(0.2, { position: cc.v3(0, 128) })
                .to(0.2, { position: cc.v3(0, 0) }, { easing: 'bounceOut' }).start();
            cc.tween(this.shadow).to(0.5, { scale: 3 }).to(0.5, { scale: 4 }).start();
        }
        this.scheduleOnce(() => {
            this.isAniming = false;
            this.isAttacking = false;
            this.isTaken = false;
            this.isThrowing = false;
            this.updateCollider();
        }, 1)
        return true;

    }
    //攻击
    private attack(): boolean {
        if (!this.isTaken || this.isAniming || !this.player) {
            return false;
        }
        this.isAniming = true;
        this.hasTargetMap = {};
        AudioPlayer.play(AudioPlayer.MELEE);
        let o = 64;
        if (this.isLift) {
            let p1 = this.node.parent.convertToNodeSpaceAR(this.player.weaponLeft.meleeWeapon.node.convertToWorldSpaceAR(cc.v3(-o / 2, 0)));
            let p2 = this.node.parent.convertToNodeSpaceAR(this.player.weaponLeft.meleeWeapon.node.convertToWorldSpaceAR(cc.v3(o,0)));
            cc.tween(this.sprite.node).to(0.2, { position: cc.v3(0, 64)}).call(() => {
                this.isAttacking = true;
            }).to(0.1, { position: cc.v3(0, 96) }).to(0.1, { position: cc.v3(0, 0) })
                .call(() => {
                    this.isAttacking = false;
                })
                .to(0.2, { position: cc.v3(0, 96) }).call(() => {
                    this.isAniming = false;
                }).start();
            cc.tween(this.node).to(0.2, { position: p1 }).to(0.2, { position: p2 }).start();
        } else {
            let p1 = this.node.parent.convertToNodeSpaceAR(this.player.weaponLeft.meleeWeapon.node.convertToWorldSpaceAR(cc.v3(0, o)));
            let p2 = this.node.parent.convertToNodeSpaceAR(this.player.weaponLeft.meleeWeapon.node.convertToWorldSpaceAR(cc.v3(o * 0.7, o * 0.7)));
            let p3 = this.node.parent.convertToNodeSpaceAR(this.player.weaponLeft.meleeWeapon.node.convertToWorldSpaceAR(cc.v3(o, 0)));
            let p4 = this.node.parent.convertToNodeSpaceAR(this.player.weaponLeft.meleeWeapon.node.convertToWorldSpaceAR(cc.v3(o * 0.7, -o * 0.7)));
            let p5 = this.node.parent.convertToNodeSpaceAR(this.player.weaponLeft.meleeWeapon.node.convertToWorldSpaceAR(cc.v3(0, -o)));

            cc.tween(this.node).to(0.15, { position: p1 }).call(() => {
                this.isAttacking = true;
            }).to(0.1, { position: p2 }).to(0.1, { position: p3 })
                .to(0.1, { position: p4 }).to(0.1, { position: p5 })
                .to(0.1, { position: p4 }).to(0.1, { position: p3 })
                .call(() => {
                    this.isAttacking = false;
                    this.isAniming = false;
                }).start();
        }
        return true;
    }
    onPreSolve(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider): void {
        if (otherCollider.tag == ColliderTag.NONPLAYER || otherCollider.tag == ColliderTag.PLAYER || otherCollider.tag == ColliderTag.GOODNONPLAYER) {
            if (this.isTaken || this.isAttacking) {
                contact.disabledOnce = true;
            }
        }
    }
    onCollisionStay(other: cc.Collider, self: cc.CircleCollider) {
        if (other.tag != ColliderTag.PLAYER && this.player && this.isTaken && this.isAttacking) {
            if(other.tag == ColliderTag.BUILDING||other.tag == ColliderTag.WALL||other.tag == ColliderTag.WALL_TOP){
                if(this.isThrowing){
                    this.rigidBody.linearVelocity = cc.Vec2.ZERO;
                }
            }
            if (this.hasTargetMap[other.node.uuid] && this.hasTargetMap[other.node.uuid] > 0) {
                this.hasTargetMap[other.node.uuid]++;
                return false;
            } else {
                this.hasTargetMap[other.node.uuid] = 1;
                return this.attacking(other);
            }
            
        }
    }
    private updatePosition() {
        this.shadow.opacity = 255;
        if (this.player && this.isTaken) {
            this.shadow.opacity = this.isThrowing ? 255 : 0;
            if (!this.isAniming) {
                if (this.isLift) {
                    this.sprite.node.position = Logic.lerpPos(this.sprite.node.position, cc.v3(0, 96), 0.1);
                    this.node.position = Logic.lerpPos(this.node.position, this.player.node.position.clone(), 0.1);
                } else {
                    let p = this.player.Hv.clone().mul(64);
                    let pos = this.player.node.position.add(p);
                    this.sprite.node.position = Logic.lerpPos(this.sprite.node.position, cc.v3(0, 0), 0.1);
                    this.node.position = Logic.lerpPos(this.node.position, pos, 0.1);
                }
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

    private beatBack(node: cc.Node, hv: cc.Vec3, power: number) {
        let rigidBody: cc.RigidBody = node.getComponent(cc.RigidBody);
        let pos = hv;
        if (pos.equals(cc.Vec3.ZERO)) {
            pos = cc.v3(1, 0);
        }
        pos = pos.normalizeSelf().mul(power);
        this.scheduleOnce(() => {
            rigidBody.applyLinearImpulse(cc.v2(pos.x, pos.y), rigidBody.getLocalCenter(), true);
        }, 0.1);
    }
    private attacking(attackTarget: cc.Collider): boolean {
        if (!attackTarget || !this.isAttacking) {
            return false;
        }
        let damage = new DamageData();
        let common = new CommonData();
        if (this.player) {
            damage = this.player.data.getFinalAttackPoint();
            common = this.player.data.FinalCommon;
        }
        damage.isMelee = true;
        damage.physicalDamage += this.isThrowing?5:3;
        let damageSuccess = false;
        let attackSuccess = false;
        if (attackTarget.tag == ColliderTag.NONPLAYER) {
            let monster = attackTarget.node.getComponent(NonPlayer);
            if (monster && !monster.sc.isDied && monster.data.isEnemy > 0) {
                damage.isBackAttack = monster.isPlayerBehindAttack() && common.damageBack > 0;
                if (damage.isBackAttack) {
                    damage.realDamage += common.damageBack;
                }
                damageSuccess = monster.takeDamage(damage);
                if (damageSuccess) {
                    this.beatBack(monster.node, this.player.Hv.clone(), 500);
                    this.addTargetAllStatus(common, monster);
                }
            }
        } else if (attackTarget.tag == ColliderTag.BOSS) {
            let boss = attackTarget.node.getComponent(Boss);
            if (boss && !boss.sc.isDied) {
                damageSuccess = boss.takeDamage(damage);
                if (damageSuccess) {
                    this.addTargetAllStatus(common, boss);
                }
            }
        } else if (attackTarget.tag == ColliderTag.BUILDING || attackTarget.tag == ColliderTag.WALL) {
            let box = attackTarget.node.getComponent(Box);
            if (box) {
                attackSuccess = true;
                box.breakBox();
            }
            if (!attackSuccess) {
                let hitBuilding = attackTarget.node.getComponent(HitBuilding);
                if (hitBuilding) {
                    attackSuccess = true;
                    hitBuilding.takeDamage(damage);
                }
            }

        }
        if (damageSuccess || attackSuccess) {
            cc.director.emit(EventHelper.CAMERA_SHAKE, { detail: { isHeavyShaking: false } });
        }
        if (damageSuccess && this.player.data.AvatarData.organizationIndex == AvatarData.TECH) {
            this.player.updateDream(-1);
        }
        return damageSuccess || attackSuccess;
    }
    private addTargetAllStatus(data: CommonData, target: Actor) {
        this.addTargetStatus(data.iceRate, target, StatusManager.FROZEN);
        this.addTargetStatus(data.fireRate, target, StatusManager.BURNING);
        this.addTargetStatus(data.lighteningRate, target, StatusManager.DIZZ);
        this.addTargetStatus(data.toxicRate, target, StatusManager.TOXICOSIS);
        this.addTargetStatus(data.curseRate, target, StatusManager.CURSING);
        this.addTargetStatus(data.realRate, target, StatusManager.BLEEDING);
    }

    private addTargetStatus(rate: number, target: Actor, statusType) {
        if (Logic.getRandomNum(0, 100) < rate) { target.addStatus(statusType, new FromData()); }
    }
}
