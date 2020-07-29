import Logic from "./Logic";
import PlayerAvatar from "./PlayerAvatar";
import EquipmentData from "./Data/EquipmentData";
import Equipment from "./Equipment/Equipment";
import { EventHelper } from "./EventHelper";
import IndexZ from "./Utils/IndexZ";
import Actor from "./Base/Actor";
import BlockLight from "./Effect/BlockLight";
import DamageData from "./Data/DamageData";
import StatusManager from "./Manager/StatusManager";
import FromData from "./Data/FromData";
import Player from "./Player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Shield extends cc.Component {
    @property(cc.Sprite)
    sprite: cc.Sprite = null;
    @property(cc.Prefab)
    blockLightPrefab:cc.Prefab = null;
    private blocklightPool: cc.NodePool;
    private status = -1;
    static readonly BLOCK_FAILED = 0;
    static readonly BLOCK_NORMAL = 1;
    static readonly BLOCK_PARRY = 2;
    static readonly STATUS_IDLE = 0;
    static readonly STATUS_PARRY = 1;
    static readonly STATUS_DEFEND = 2;
    static readonly STATUS_PUTDOWN = 3;
    private static readonly ZOFFSET = 2;
    private static readonly DEFAULT_POS = [cc.v3(0,32),cc.v3(0,48),cc.v3(-8,48),cc.v3(-8,48)];
    private static readonly TRANSFORM_POS = [cc.v3(32,40),cc.v3(32,40),cc.v3(10,44),cc.v3(10,44)];
    private static readonly DEFEND_POS = [cc.v3(0,48),cc.v3(0,32),cc.v3(24,40),cc.v3(24,40)];
    data: EquipmentData = new EquipmentData();
    private isBehind = false;
    private avatarZindex = 0;
    private isBehindChange = false;
    private dir = 3;
    private isButtonPressing = false;
    get isAniming(){
        return this.status == Shield.STATUS_PUTDOWN || this.status == Shield.STATUS_PARRY;
    }
    get isDefendOrParrying(){
        return this.status == Shield.STATUS_DEFEND||this.status == Shield.STATUS_PARRY;
    }

    get Status() {
        return this.status;
    }
    onLoad() {
        
        cc.director.on(EventHelper.POOL_DESTORY_BLOCKLIGHT, (event) => {
            this.destroySmoke(event.detail.targetNode);
        })
        this.blocklightPool = new cc.NodePool();
    }
    public getBlockLight(parentNode: cc.Node, pos: cc.Vec3) {
        let prefab: cc.Node = null;
        if (this.blocklightPool.size() > 0) {
            prefab = this.blocklightPool.get();
        }
        if (!prefab || prefab.active) {
            prefab = cc.instantiate(this.blockLightPrefab);
        }
        prefab.parent = parentNode;
        prefab.position = pos;
        prefab.zIndex = IndexZ.OVERHEAD;
        prefab.scale = this.status == Shield.STATUS_PARRY?2:1;
        prefab.opacity = 255;
        prefab.active = true;
        prefab.getComponent(BlockLight).show();
    }
    public blockDamage(player:Player,damage:DamageData, actor:Actor):number{
        if(this.status<0||this.status == Shield.STATUS_IDLE||this.status == Shield.STATUS_PUTDOWN){
            return 0;
        }
        if(damage.getTotalDamage()<=0){
            return 0;
        }
        let pos = player.node.parent.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.Vec2.ZERO));
        this.getBlockLight(player.node.parent,cc.v3(pos.x,pos.y));
        if(actor){
            if(this.status == Shield.STATUS_PARRY){
                actor.addStatus(StatusManager.SHIELD_PARRY,new FromData());
                actor.takeDamage(new DamageData(this.data.Common.blockDamage));

                if(this.data.statusNameParryOther.length>0&&this.data.statusRateParry>Logic.getRandomNum(0,100)){
                    actor.addStatus(this.data.statusNameParryOther,new FromData());
                }
                if(this.data.statusNameParrySelf.length>0&&this.data.statusRateParry>Logic.getRandomNum(0,100)){
                    player.addStatus(this.data.statusNameParrySelf,new FromData());
                }
                
            }
            if(this.status == Shield.STATUS_DEFEND){
                if(this.data.statusNameBlockOther.length>0&&this.data.statusRateBlock>Logic.getRandomNum(0,100)){
                    actor.addStatus(this.data.statusNameBlockOther,new FromData());
                }
                if(this.data.statusNameBlockSelf.length>0&&this.data.statusRateBlock>Logic.getRandomNum(0,100)){
                    player.addStatus(this.data.statusNameBlockSelf,new FromData());
                }
            }
        }
        
        return this.status == Shield.STATUS_PARRY?Shield.BLOCK_PARRY:Shield.BLOCK_NORMAL;
    }
    private destroySmoke(targetNode: cc.Node) {
        if (!targetNode) {
            return;
        }
        targetNode.active = false;
        if (this.blocklightPool) {
            this.blocklightPool.put(targetNode);
        }
    }
    
    private playIdle() {
        if (this.status == Shield.STATUS_DEFEND 
            || this.status == Shield.STATUS_PARRY 
            || this.status == Shield.STATUS_IDLE) {
            return;
        }
        this.status = Shield.STATUS_IDLE;
        cc.log(`等待 isBehind:${this.isBehind} zIndex:${this.node.zIndex}`);
        this.sprite.node.stopAllActions();
        let duration = this.data.isHeavy==1?0.4:0.2;
        let idle = cc.tween().to(duration, { y: 2 }).to(duration, { y: -2 });
        cc.tween(this.sprite.node).repeatForever(idle).start();
    }
    private playParry() {
        if (this.status == Shield.STATUS_PUTDOWN
            || this.status == Shield.STATUS_DEFEND
            || this.status == Shield.STATUS_PARRY) {
            return;
        }
        this.status = Shield.STATUS_PARRY;
        let duration = this.data.isHeavy==1?0.15:0.1;
        let durationdelay = this.data.isHeavy==1?0.1:0.15;
        cc.log(`举起 isBehind:${this.isBehind} zIndex:${this.node.zIndex}`);
        cc.tween(this.node).to(duration,{position:Shield.TRANSFORM_POS[this.dir]}).call(()=>{
            this.node.zIndex = this.isBehind?this.avatarZindex+Shield.ZOFFSET:this.avatarZindex-Shield.ZOFFSET;
            this.sprite.node.color = this.isBehind?cc.Color.WHITE:cc.color(32,32,32);
        }).to(duration,{position:Shield.DEFEND_POS[this.dir]}).delay(durationdelay).call(()=>{
            if(this.isButtonPressing){
                this.playDefend();
            }else{
                this.playPutDown();
            }
        }).start();
    }
    private playDefend() {
        if (this.status == Shield.STATUS_PUTDOWN
            || this.status == Shield.STATUS_DEFEND) {
            return;
        }
        this.status = Shield.STATUS_DEFEND;
        cc.log(`防御 isBehind:${this.isBehind} zIndex:${this.node.zIndex}`);
    }
    private playPutDown(){
        if (this.status == Shield.STATUS_PUTDOWN
            || this.status == Shield.STATUS_IDLE) {
            return;
        }
        let isBehindTemp = this.isBehindChange?!this.isBehind:this.isBehind;
        this.status = Shield.STATUS_PUTDOWN;
        let duration = this.data.isHeavy==1?0.2:0.1;
        cc.log(`放下 isBehind:${this.isBehind} isBehindTemp:${isBehindTemp} zIndex:${this.node.zIndex}`);
        cc.tween(this.node).to(duration,{position:Shield.TRANSFORM_POS[this.dir]}).call(()=>{
            this.node.zIndex = isBehindTemp?this.avatarZindex-Shield.ZOFFSET:this.avatarZindex+Shield.ZOFFSET;
            this.sprite.node.color = isBehindTemp?cc.color(32,32,32):cc.Color.WHITE;
        }).to(duration,{position:Shield.DEFAULT_POS[this.dir]}).call(()=>{
            this.playIdle();
        }).start();
    }

    public changeZIndexByDir(avatarZindex: number, dir: number) {
        if(this.isAniming){
            return;
        }
        this.avatarZindex = avatarZindex;
        this.dir = dir;
        let isDefending = this.status == Shield.STATUS_DEFEND;
        let currentIndex = avatarZindex - Shield.ZOFFSET;
        switch (dir) {
            case PlayerAvatar.DIR_UP:
                currentIndex = avatarZindex + (isDefending?-Shield.ZOFFSET:Shield.ZOFFSET);
                this.sprite.node.color = isDefending?cc.color(32,32,32):cc.Color.WHITE;
                break;
            case PlayerAvatar.DIR_DOWN:
                currentIndex = avatarZindex + (isDefending?Shield.ZOFFSET:-Shield.ZOFFSET);
                this.sprite.node.color =  isDefending?cc.Color.WHITE:cc.color(32,32,32);
                break;
            case PlayerAvatar.DIR_LEFT:
            case PlayerAvatar.DIR_RIGHT:
                currentIndex = avatarZindex + (isDefending?Shield.ZOFFSET:-Shield.ZOFFSET);
                this.sprite.node.color =  isDefending?cc.Color.WHITE:cc.color(32,32,32);
                break;
        }
        let temp = this.isBehind;
        this.isBehind = dir != PlayerAvatar.DIR_UP;
        this.isBehindChange = this.isBehind != temp;
        this.node.zIndex = currentIndex;
        this.node.position = isDefending?Shield.DEFEND_POS[dir]:Shield.DEFAULT_POS[dir];
    }
    public use() {
        this.isButtonPressing = true;
        if (this.data.equipmetType != Equipment.SHIELD) {
            return;
        }
        if (this.status == Shield.STATUS_PUTDOWN) {
            return;
        }
        if (this.isDefendOrParrying) {
            return;
        }
        this.playParry();
    }
    public cancel(){
        this.isButtonPressing = false;
        if (this.status != Shield.STATUS_DEFEND) {
            return;
        }
        this.playPutDown();
    }
    changeRes(resName: string) {
        if (!resName || resName.length < 1) {
            return;
        }
        this.sprite.spriteFrame = Logic.spriteFrames[resName];
        this.sprite.node.width = this.data.isHeavy==1?80:64;
        this.sprite.node.height = this.data.isHeavy==1?80:64;
        if(this.data.equipmetType == Equipment.SHIELD){
            this.playIdle();
        }
    }
 
}