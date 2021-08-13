// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dungeon from "../Dungeon";
import Logic from "../Logic";
import Player from "../Player";
import PlayerWeapon from "../PlayerWeapon";
import Shooter from "../Shooter";
import IndexZ from "../Utils/IndexZ";
import NextStep from "../Utils/NextStep";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShadowPlayer extends cc.Component {

    @property(PlayerWeapon)
    weaponLeft: PlayerWeapon = null;
    @property(PlayerWeapon)
    weaponRight: PlayerWeapon = null;
    @property(Shooter)
    shooterEx: Shooter = null;
    @property(cc.Sprite)
    sprite: cc.Sprite = null;
    player: Player;
    mat: cc.MaterialVariant;
    index = 0;
    lifeNext:NextStep = new NextStep();
    isStop = false;
    targetPos:cc.Vec3 = cc.v3(0,0);
    movePos:cc.Vec3 = cc.v3(0,0);
    playerLastPos:cc.Vec3 = cc.v3(0,0);

    // LIFE-CYCLE CALLBACKS:

    init(player: Player, spriteframe: cc.SpriteFrame, index: number, lifeTime: number) {
        this.player = player;
        this.index = index;
        this.player.data.ShadowList[this.index] = lifeTime?lifeTime:30;
        this.node.parent = this.player.node.parent;
        this.weaponLeft.init(this.player, true, true);
        this.weaponRight.init(this.player, false, true);
        this.weaponLeft.node.opacity = 0;
        this.weaponRight.node.opacity = 0;
        this.shooterEx.player = this.player;
        this.shooterEx.isEx = true;
        this.mat = this.sprite.getMaterial(0);
        this.sprite.node.scaleX = 3;
        this.sprite.node.scaleY = -3;
        this.sprite.spriteFrame = spriteframe;
        this.node.zIndex = IndexZ.getActorZIndex(Dungeon.getIndexInMap(this.node.position));
        this.sprite.node.width = this.sprite.spriteFrame.getRect().width;
        this.sprite.node.height = this.sprite.spriteFrame.getRect().height;
        this.node.position = this.player.node.position.clone();
        this.targetPos = this.player.node.position.clone();
        this.playerLastPos = this.player.node.position.clone();
        this.isStop = false;
        this.lifeNext.next(()=>{
        },lifeTime?lifeTime:30,true,(secondCount:number)=>{
            if(secondCount>=0&&this.node&&this.isValid&&!this.isStop){
                this.player.data.ShadowList[this.index] = secondCount;
            }
            if(secondCount<=0){
                this.stop();
            }
        })
    }
    stop(){
        if (this.isValid) {
            this.isStop = true;
            this.player.data.ShadowList[this.index] = 0;
            this.destroy();
        }
    }

    updateLogic(dt: number) {
        if (this.player) {
            this.movePos.x += Math.abs(this.player.node.position.x-this.playerLastPos.x);
            this.movePos.y += Math.abs(this.player.node.position.y-this.playerLastPos.y);
            this.playerLastPos = this.player.node.position.clone();
            if(this.movePos.x>(this.index+1)*200||this.movePos.y>(this.index+1)*200){
                this.movePos = cc.v3(0,0);
                this.targetPos = this.player.node.position.clone();
            }
            this.node.zIndex = IndexZ.getActorZIndex(Dungeon.getIndexInMap(this.node.position));
            this.node.position = Logic.lerpPos(this.node.position, this.targetPos, dt * 5);
            this.sprite.node.opacity = 200 - this.index * 20;
            this.mat.setProperty('textureSizeWidth', this.sprite.spriteFrame.getTexture().width * 3);
            this.mat.setProperty('textureSizeHeight', this.sprite.spriteFrame.getTexture().height * 3);
            this.mat.setProperty('outlineColor', cc.color(200, 200, 200));
            this.mat.setProperty('outlineSize', 4);
        }
    }
}
