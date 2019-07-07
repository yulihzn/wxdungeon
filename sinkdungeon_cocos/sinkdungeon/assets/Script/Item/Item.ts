import { EventConstant } from "../EventConstant";
import Player from "../Player";
import Logic from "../Logic";
import DamageData from "../Data/DamageData";
import ItemData from "../Data/ItemData";
import StatusManager from "../Manager/StatusManager";

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
const {ccclass, property} = cc._decorator;

@ccclass
export default class Item extends cc.Component {

    public static readonly HEART = 'heart';
    public static readonly AMMO = 'ammo';
    public static readonly REDCAPSULE = 'redcapsule';
    public static readonly BLUECAPSULE = 'bluecapsule';
    public static readonly SHIELD = 'shield';
    public static readonly GOLDAPPLE = 'goldapple';
    anim:cc.Animation;
    data:ItemData = new ItemData();

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.anim = this.getComponent(cc.Animation);
    }
    init(resName:string,pos:cc.Vec2){
        this.data.uuid = this.data.genNonDuplicateID();
        this.data.resName = resName;
        this.data.pos = pos;
        let spriteFrame = Logic.spriteFrames[this.data.resName];
        if(spriteFrame){
            let sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
            this.node.getChildByName('sprite').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            sprite.node.width = spriteFrame.getRect().width*2;
            sprite.node.height = spriteFrame.getRect().height*2;
        }
    }
    private taken(player:Player):void{
        if(!this.data.isTaken && this.anim){
            this.anim.play('ItemTaken');
            this.data.isTaken = true;
            this.getEffect(player);
            this.scheduleOnce(()=>{
                if(this.node){
                    this.node.active = false;
                }
            },3);
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
    }
    private getEffect(player:Player){
        switch(this.data.resName){
            case Item.HEART:player.addStatus(StatusManager.HEALING);break;
            case Item.AMMO:Logic.ammo+=30;break;
            case Item.REDCAPSULE:player.addStatus(StatusManager.FASTATTACK);break;
            case Item.BLUECAPSULE:player.addStatus(StatusManager.FASTMOVE);break;
            case Item.SHIELD:player.addStatus(StatusManager.PERFECTDEFENCE);break;
            case Item.GOLDAPPLE:player.addStatus(StatusManager.GOLDAPPLE);break;
        }
    }
    onCollisionEnter(other:cc.Collider,self:cc.Collider){
        let player = other.node.getComponent(Player);
        if(player){
            this.taken(player);
        }
    }
    // update (dt) {}
}
