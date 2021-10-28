// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Building from "./Building";
import DamageData from "../data/DamageData";
import Logic from "../logic/Logic";
import Dungeon from "../logic/Dungeon";
import IndexZ from "../utils/IndexZ";
import AudioPlayer from "../utils/AudioPlayer";
import CCollider from "../collider/CCollider";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HitBuilding extends Building {

    private mat: cc.MaterialVariant;
    private sprite: cc.Sprite;
    private resName = '';
    private itemNames: string[] = [];
    private equipmentNames: string[] = [];
    private dungeon: Dungeon;
    private isCustom = false;
    private colliderExtrude = 0;
    // LIFE-CYCLE CALLBACKS:

    init(dungeon: Dungeon, resName: string, itemNames: string[], equipmentNames: string[], maxHealth: number, currentHealth: number, scale: number, isCustom: boolean, colliderExtrude: number) {
        this.dungeon = dungeon;
        this.resName = resName;
        this.itemNames = itemNames;
        this.equipmentNames = equipmentNames;
        this.data.maxHealth = maxHealth;
        this.data.currentHealth = currentHealth;
        this.colliderExtrude = colliderExtrude;
        this.isCustom = isCustom;
        if (!this.sprite) {
            this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
        }
        this.sprite.node.scale = scale;
        this.changeRes(resName, `${this.data.currentHealth}`);
        if (this.data.currentHealth <= 0) {
            this.getComponent(CCollider).sensor = true;
        }
    }
    hitLight(isHit: boolean) {
        if (!this.mat) {
            this.mat = this.node.getChildByName('sprite').getComponent(cc.Sprite).getMaterial(0);
        }
        this.mat.setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT);
    }
    setDefaultPos(defaultPos: cc.Vec3) {
        this.data.defaultPos = defaultPos;
        this.entity.Transform.position = Dungeon.getPosInMap(defaultPos);
        this.node.position = this.entity.Transform.position.clone();
        this.node.zIndex = IndexZ.getActorZIndex(this.entity.Transform.position);
    }
    takeDamage(damage: DamageData): boolean {
        if (this.data.currentHealth <= 0 || this.data.currentHealth >= 9999) {
            return false;
        }
        let hitNames = [AudioPlayer.MONSTER_HIT, AudioPlayer.MONSTER_HIT1, AudioPlayer.MONSTER_HIT2];
        AudioPlayer.play(hitNames[Logic.getRandomNum(0, 2)]);
        this.data.currentHealth -= 1;
        this.changeRes(this.resName, `${this.data.currentHealth}`)
        this.hitLight(true);
        this.scheduleOnce(() => {
            this.hitLight(false);
        }, 0.15);
        if (this.data.currentHealth <= 0) {
            for (let name of this.itemNames) {
                if (name && name.length > 0) {
                    this.dungeon.addItem(this.entity.Transform.position.clone(), name);
                }
            }
            for (let name of this.equipmentNames) {
                if (name && name.length > 0) {
                    this.dungeon.addEquipment(name, Dungeon.getPosInMap(this.data.defaultPos), null, 1);
                }
            }

            this.getComponent(CCollider).sensor = true;
        }
        let saveHit = Logic.mapManager.getCurrentMapBuilding(this.data.defaultPos);
        if (saveHit) {
            saveHit.currentHealth = this.data.currentHealth;
        }
        return true;
    }
    /**贴图后缀数字表示血量，例如car car0 car1 */
    private changeRes(resName: string, suffix?: string) {
        if (!this.sprite) {
            this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
        }
        let spriteFrame = Logic.spriteFrameRes(resName);
        let width = (spriteFrame.getOriginalSize().width - this.colliderExtrude) * this.sprite.node.scale;
        let height = (spriteFrame.getOriginalSize().height - this.colliderExtrude) * this.sprite.node.scale;
        if (suffix && Logic.spriteFrameRes(resName + suffix)) {
            spriteFrame = Logic.spriteFrameRes(resName + suffix);
        }
        if (!spriteFrame) {
            return;
        }
        this.sprite.node.opacity = 255;
        this.sprite.node.width = spriteFrame.getOriginalSize().width;
        this.sprite.node.height = spriteFrame.getOriginalSize().height;
        if (this.isCustom) {
            return;
        }
        let size = cc.size(width, height);
        let collider = this.getComponent(cc.BoxCollider);
        let pcollider = this.getComponent(CCollider);
        collider.size = size.clone();
        pcollider.size = size.clone();
        this.sprite.spriteFrame = spriteFrame;
    }
    // update (dt) {}
}
