import { EventHelper } from "../EventHelper";
import Player from "../Player";
import Logic from "../Logic";
import DamageData from "../Data/DamageData";
import ItemData from "../Data/ItemData";
import StatusManager from "../Manager/StatusManager";
import AudioPlayer from "../Utils/AudioPlayer";
import FromData from "../Data/FromData";
import ShopTable from "../Building/ShopTable";
import ItemDialog from "./ItemDialog";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
//物品
const { ccclass, property } = cc._decorator;

@ccclass
export default class Item extends cc.Component {

    public static readonly EMPTY = 'emptyitem';
    public static readonly HEART = 'heart';
    public static readonly BOTTLE_HEALING = 'bottle001';
    public static readonly BOTTLE_MOVESPEED = 'bottle002';
    public static readonly BOTTLE_ATTACKSPEED = 'bottle003';
    public static readonly BOTTLE_INVISIBLE = 'bottle004';
    public static readonly AMMO = 'ammo';
    public static readonly REDCAPSULE = 'redcapsule';
    public static readonly BLUECAPSULE = 'bluecapsule';
    public static readonly SHIELD = 'shield';
    public static readonly GOLDAPPLE = 'goldapple';
    anim: cc.Animation;
    data: ItemData = new ItemData();
    shopTable: ShopTable;
    @property(ItemDialog)
    itemDialog: ItemDialog = null;

    sprite:cc.Sprite;
    mat:cc.MaterialVariant;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }

    start() {
        this.anim = this.getComponent(cc.Animation);
    }
    init(resName: string, pos: cc.Vec3, shopTable?: ShopTable) {
        this.data.valueCopy(Logic.items[resName]);
        this.data.uuid = this.data.genNonDuplicateID();
        this.data.pos = pos;
        if (shopTable) {
            this.shopTable = shopTable;
            shopTable.data.itemdata = new ItemData();
            shopTable.data.itemdata.valueCopy(Logic.items[resName]);
            shopTable.data.price = this.data.price;
        }
        let spriteFrame = Logic.spriteFrames[this.data.resName];
        if (spriteFrame) {
            this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
            this.node.getChildByName('sprite').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            this.sprite.node.width = spriteFrame.getRect().width * 2;
            this.sprite.node.height = spriteFrame.getRect().height * 2;
            this.mat = this.sprite.getComponent(cc.Sprite).getMaterial(0);
            this.mat.setProperty('textureSizeWidth',this.sprite.node.width*this.sprite.node.scaleX);
            this.mat.setProperty('textureSizeHeight',this.sprite.node.height*this.sprite.node.scaleY);
            this.highLight(false);
        }
        this.itemDialog.refreshDialog(this.data);
    }

    highLight(isHigh:boolean){
        if(!this.mat){
            this.mat = this.sprite.getComponent(cc.Sprite).getMaterial(0);
        }
        this.mat.setProperty('outlineColor',isHigh?cc.Color.WHITE:cc.Color.TRANSPARENT);
    }

    public taken(player: Player): void {
        if (!this.data.isTaken && this.anim) {
            cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.PICK_ITEM } });
            this.anim.play('ItemTaken');
            this.data.isTaken = true;
            if (this.data.canSave < 1) {
                Item.userIt(this.data, player);
            } else {
                cc.director.emit(EventHelper.PLAYER_CHANGEITEM, { detail: { itemData: this.data } })
            }
            this.scheduleOnce(() => {
                if (this.node) {
                    this.node.active = false;
                }
            }, 3);
        }
        let curritems = Logic.mapManager.getCurrentMapItems();
        let newlist: ItemData[] = new Array();
        if (curritems) {
            for (let temp of curritems) {
                if (temp.uuid && temp.uuid != this.data.uuid) {
                    newlist.push(temp);
                }
            }
        }
        Logic.mapManager.setCurrentItemsArr(newlist);
        this.itemDialog.node.active = false;
    }
    static userIt(data: ItemData, player: Player) {
        let from = FromData.getClone(data.nameCn, data.resName);
        if (data.resName != Item.EMPTY && data.canSave) {
            cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.PICK_ITEM } });
        }
        switch (data.resName) {
            case Item.HEART: player.addStatus(StatusManager.HEALING, from); break;
            case Item.BOTTLE_HEALING: player.addStatus(StatusManager.BOTTLE_HEALING, from); break;
            case Item.BOTTLE_MOVESPEED: player.addStatus(StatusManager.FASTMOVE, from); break;
            case Item.BOTTLE_ATTACKSPEED: player.addStatus(StatusManager.FASTATTACK, from); break;
            case Item.BOTTLE_INVISIBLE: player.addStatus(StatusManager.BOTTLE_INVISIBLE, from); break;
            case Item.AMMO: Logic.ammo += 30; break;
            case Item.REDCAPSULE: player.addStatus(StatusManager.FASTATTACK, from); break;
            case Item.BLUECAPSULE: player.addStatus(StatusManager.FASTMOVE, from); break;
            case Item.SHIELD: player.addStatus(StatusManager.PERFECTDEFENCE, from); break;
            case Item.GOLDAPPLE: player.addStatus(StatusManager.GOLDAPPLE, from); break;
        }
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let player = other.node.getComponent(Player);
        if (player) {
            if (this.data.canSave) {
                this.itemDialog.showDialog();
                this.highLight(true);
                this.node.getChildByName('sprite').getChildByName('taketips').runAction(cc.sequence(cc.fadeIn(0.2),cc.delayTime(1),cc.fadeOut(0.2)));
            } else {
                this.taken(player);
            }
        }

    }
    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        let player = other.node.getComponent(Player);
        if (player) {
            this.highLight(false);
            this.itemDialog.hideDialog();
        }
    }

    // update (dt) {}
}
