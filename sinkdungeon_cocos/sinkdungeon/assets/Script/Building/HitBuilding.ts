// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Building from "./Building";
import DamageData from "../Data/DamageData";
import Logic from "../Logic";
import Dungeon from "../Dungeon";
import IndexZ from "../Utils/IndexZ";
import AudioPlayer from "../Utils/AudioPlayer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HitBuilding extends Building {

    private mat: cc.MaterialVariant;
    private sprite: cc.Sprite;
    private resName = '';
    private itemNames:string[] = [];
    private equipmentNames:string[] = [];
    private dungeon: Dungeon;
    // LIFE-CYCLE CALLBACKS:

    init(dungeon: Dungeon, resName: string, itemNames: string[], equipmentNames: string[], maxHealth: number, currentHealth: number) {
        this.dungeon = dungeon;
        this.resName = resName;
        this.itemNames = itemNames;
        this.equipmentNames = equipmentNames;
        this.data.maxHealth = maxHealth;
        this.data.currentHealth = currentHealth;
        this.changeRes(resName, `${this.data.currentHealth}`);
        if(this.data.currentHealth<=0){
            this.getComponent(cc.PhysicsBoxCollider).sensor = true;
            this.getComponent(cc.PhysicsBoxCollider).apply();
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
        this.node.position = Dungeon.getPosInMap(defaultPos);
        this.node.zIndex = IndexZ.getActorZIndex(this.node.position);
    }
    takeDamage(damage: DamageData): boolean {
        if (this.data.currentHealth <= 0) {
            return false;
        }
        AudioPlayer.play(AudioPlayer.MONSTER_HIT);
        this.data.currentHealth -= 1;
        this.changeRes(this.resName, `${this.data.currentHealth}`)
        this.hitLight(true);
        this.scheduleOnce(() => {
            this.hitLight(false);
        }, 0.15);
        if (this.data.currentHealth <= 0) {
            for(let name of this.itemNames){
                if (name && name.length > 0) {
                    this.dungeon.addItem(this.node.position.clone(), name);
                }
            }
            for(let name of this.equipmentNames){
                if (name && name.length > 0) {
                    this.dungeon.addEquipment(name, this.data.defaultPos, null, 1);
                }
            }
            
            this.getComponent(cc.PhysicsBoxCollider).sensor = true;
            this.getComponent(cc.PhysicsBoxCollider).apply();
        }
        let saveHit = Logic.mapManager.getCurrentMapBuilding(this.data.defaultPos);
        if (saveHit) {
            saveHit.currentHealth = this.data.currentHealth;
        }
        return true;
    }
    /**贴图后缀数字表示血量，例如car car0 car1 */
    changeRes(resName: string, suffix?: string) {
        if (!this.sprite) {
            this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
        }
        let spriteFrame = Logic.spriteFrames[resName];
        if (suffix && Logic.spriteFrames[resName + suffix]) {
            spriteFrame = Logic.spriteFrames[resName + suffix];
        }
        this.sprite.node.opacity = 255;
        this.sprite.node.width = spriteFrame.getRect().width;
        this.sprite.node.height = spriteFrame.getRect().height;
        this.sprite.spriteFrame = spriteFrame;
    }
    // update (dt) {}
}
