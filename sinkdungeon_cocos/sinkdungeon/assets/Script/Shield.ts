import Logic from "./Logic";
import PlayerAvatar from "./PlayerAvatar";
import EquipmentData from "./Data/EquipmentData";
import Equipment from "./Equipment/Equipment";
import { EventHelper } from "./EventHelper";
import IndexZ from "./Utils/IndexZ";
import Actor from "./Base/Actor";
import Player from "./Player";
import Dungeon from "./Dungeon";
import BlockLight from "./Effect/BlockLight";
import DamageData from "./Data/DamageData";

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
    static readonly BLOCK_REFLECT = 2;
    static readonly STATUS_IDLE = 0;
    static readonly STATUS_REFLECT = 1;
    static readonly STATUS_DEFEND = 2;
    static readonly STATUS_PUTDOWN = 3;
    private static readonly ZOFFSET = 2;
    private static readonly DEFAULT_POS = [cc.v3(0,32),cc.v3(0,48),cc.v3(-8,48),cc.v3(-8,48)];
    private static readonly TRANSFORM_POS = [cc.v3(32,40),cc.v3(32,40),cc.v3(20,44),cc.v3(20,44)];
    private static readonly DEFEND_POS = [cc.v3(0,48),cc.v3(0,32),cc.v3(32,40),cc.v3(32,40)];
    data: EquipmentData = new EquipmentData();
    private isBehind = false;
    private avatarZindex = 0;
    private isBehindChange = false;
    private dir = 3;
    private isButtonPressing = false;
    get isAniming(){
        return this.status == Shield.STATUS_PUTDOWN || this.status == Shield.STATUS_REFLECT;
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
        prefab.scale = this.status == Shield.STATUS_REFLECT?2:1;
        prefab.opacity = 255;
        prefab.active = true;
        prefab.getComponent(BlockLight).show();
    }
    public blockDamage(parentNode:cc.Node, actor:Actor):number{
        if(this.status == Shield.STATUS_IDLE||this.status == Shield.STATUS_PUTDOWN){
            return 0;
        }
        let pos = parentNode.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.Vec2.ZERO));
        this.getBlockLight(parentNode,cc.v3(pos.x,pos.y));
        return this.status == Shield.STATUS_REFLECT?Shield.BLOCK_REFLECT:Shield.BLOCK_NORMAL;
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
            || this.status == Shield.STATUS_REFLECT 
            || this.status == Shield.STATUS_IDLE) {
            return;
        }
        this.status = Shield.STATUS_IDLE;
        cc.log(`等待 isBehind:${this.isBehind} zIndex:${this.node.zIndex}`);
        this.sprite.node.stopAllActions();
        let idle = cc.tween().to(0.2, { y: 2 }).to(0.2, { y: -2 });
        cc.tween(this.sprite.node).repeatForever(idle).start();
    }
    private playReflect() {
        if (this.status == Shield.STATUS_PUTDOWN
            || this.status == Shield.STATUS_DEFEND
            || this.status == Shield.STATUS_REFLECT) {
            return;
        }
        this.status = Shield.STATUS_REFLECT;
        cc.log(`举起 isBehind:${this.isBehind} zIndex:${this.node.zIndex}`);
        cc.tween(this.node).to(0.1,{position:Shield.TRANSFORM_POS[this.dir]}).call(()=>{
            this.node.zIndex = this.isBehind?this.avatarZindex+Shield.ZOFFSET:this.avatarZindex-Shield.ZOFFSET;
            this.sprite.node.color = this.isBehind?cc.Color.WHITE:cc.color(32,32,32);
        }).to(0.1,{position:Shield.DEFEND_POS[this.dir]}).delay(0.2).call(()=>{
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
        cc.log(`放下 isBehind:${this.isBehind} isBehindTemp:${isBehindTemp} zIndex:${this.node.zIndex}`);
        cc.tween(this.node).to(0.1,{position:Shield.TRANSFORM_POS[this.dir]}).call(()=>{
            this.node.zIndex = isBehindTemp?this.avatarZindex-Shield.ZOFFSET:this.avatarZindex+Shield.ZOFFSET;
            this.sprite.node.color = isBehindTemp?cc.color(32,32,32):cc.Color.WHITE;
        }).to(0.1,{position:Shield.DEFAULT_POS[this.dir]}).call(()=>{
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
        if (this.status == Shield.STATUS_DEFEND
            || this.status == Shield.STATUS_REFLECT) {
            return;
        }
        this.playReflect();
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
        if(this.data.equipmetType == Equipment.SHIELD){
            this.playIdle();
        }
    }
 
}