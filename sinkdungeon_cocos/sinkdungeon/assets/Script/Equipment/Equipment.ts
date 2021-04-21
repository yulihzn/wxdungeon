import Logic from "../Logic";
import EquipmentData from "../Data/EquipmentData";
import { EventHelper } from "../EventHelper";
import Player from "../Player";
import ShopTable from "../Building/ShopTable";
import Dungeon from "../Dungeon";
import AudioPlayer from "../Utils/AudioPlayer";
import { ColliderTag } from "../Actor/ColliderTag";

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
export default class Equipment extends cc.Component {
    public static readonly EMPTY = 'empty';
    public static readonly WEAPON = 'weapon';
    public static readonly REMOTE = 'remote';
    public static readonly SHIELD = 'shield';
    public static readonly CLOTHES = 'clothes';
    public static readonly HELMET = 'helmet';
    public static readonly CLOAK = 'cloak';
    public static readonly TROUSERS = 'trousers';
    public static readonly SHOES = 'shoes';
    public static readonly GLOVES = 'gloves';
    data: EquipmentData = new EquipmentData();
    anim: cc.Animation;
    private sprite: cc.Node;
    pos: cc.Vec3 = cc.v3(0, 0);
    isTaken = false;
    shopTable: ShopTable;
    mat: cc.MaterialVariant;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.isTaken = false;
        this.sprite = this.node.getChildByName('sprite');
    }
    refresh(data: EquipmentData) {
        this.data.valueCopy(data);
        let spriteFrame = Logic.spriteFrameRes(this.data.img);
        if (data.equipmetType == 'trousers') {
            spriteFrame = data.trouserslong == 1 ? Logic.spriteFrameRes('trousers000') : spriteFrame;
        }
        if (data.equipmetType == 'clothes') {
            spriteFrame = Logic.spriteFrameRes(this.data.img + 'anim0');
        } else if (data.equipmetType == 'helmet') {
            spriteFrame = Logic.spriteFrameRes(this.data.img + 'anim0');
        } else if (data.equipmetType == 'remote') {
            spriteFrame = Logic.spriteFrameRes(this.data.img + 'anim0');
        }
        this.sprite.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        this.sprite.width = spriteFrame.getRect().width;
        this.sprite.height = spriteFrame.getRect().height;
        let color = cc.color(255, 255, 255).fromHEX(this.data.color);
        this.sprite.color = color;
        this.mat = this.sprite.getComponent(cc.Sprite).getMaterial(0);
        this.mat.setProperty('textureSizeWidth', spriteFrame.getTexture().width * this.sprite.scaleX);
        this.mat.setProperty('textureSizeHeight', spriteFrame.getTexture().height * this.sprite.scaleY);
        this.mat.setProperty('outlineColor', cc.Color.WHITE);
        this.highLight(false);
        if (data.equipmetType == 'remote') {
            this.sprite.width = this.sprite.width / 2;
            this.sprite.height = this.sprite.height / 2;
        }
        this.data.pos = Dungeon.getIndexInMap(this.node.position.clone());

    }

    highLight(isHigh: boolean) {
        if (!this.mat) {
            this.mat = this.sprite.getComponent(cc.Sprite).getMaterial(0);
        }
        this.mat.setProperty('openOutline', isHigh ? 1 : 0);
    }

    start() {
        // Logic.setAlias(this.node);
        this.anim = this.getComponent(cc.Animation);
    }
    onEnable() {

    }
    taken():boolean{
        if (this.isTaken) {
            return false;
        }
        if (this.shopTable) {
            if (Logic.coins >= this.data.price) {
                cc.director.emit(EventHelper.HUD_ADD_COIN, { detail: { count: -this.data.price } });
                cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.COIN } });
                this.shopTable.sale(true);
                this._taken();
                return true;
            }
        } else {
            this._taken();
            return true;
        }
        return false;
    }
    private _taken() {
        this.isTaken = true;
        this.anim.play('EquipmentTaken');
        cc.director.emit(EventHelper.PLAYER_CHANGEEQUIPMENT, { detail: { equipData: this.data } })
        this.node.getChildByName('shadow').active = false;
        cc.director.emit(EventHelper.HUD_GROUND_EQUIPMENT_INFO_HIDE);
        this.scheduleOnce(() => {
            if (this.node) {
                this.destroy();
            }
        }, 1);
        let currequipments = Logic.mapManager.getCurrentMapEquipments();
        let newlist: EquipmentData[] = new Array();
        if (currequipments) {
            for (let temp of currequipments) {
                if (temp.uuid && temp.uuid != this.data.uuid) {
                    newlist.push(temp);
                }
            }
        }
        Logic.mapManager.setCurrentEquipmentsArr(newlist);
        cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.PICK_UP } });
    }

    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        if (other.tag == ColliderTag.PLAYER) {
            cc.director.emit(EventHelper.HUD_GROUND_EQUIPMENT_INFO_HIDE);
            this.highLight(false);
        }
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.tag == ColliderTag.PLAYER) {
            this.highLight(true);
            this.node.getChildByName('sprite').getChildByName('taketips').runAction(cc.sequence(cc.fadeIn(0.2), cc.delayTime(1), cc.fadeOut(0.2)));
            cc.director.emit(EventHelper.HUD_GROUND_EQUIPMENT_INFO_SHOW, { detail: { equipData: this.data } });
        }
    }
    // update (dt) {}
}
