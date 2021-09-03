import Dungeon from "../Dungeon";
import Logic from "../Logic";
import IndexZ from "../Utils/IndexZ";
import Building from "./Building";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class DecorationFloor extends Building {
    parallexLevel = 0;
    readonly RANGE = 300;
    dungeon:Dungeon;
    originPos:cc.Vec3;
    init(dungeon:Dungeon,resName:string,scale:number,parallexLevel:number,anchor?:cc.Vec3,opacity?:number,zIndex?:number){
        this.dungeon = dungeon;
        this.parallexLevel = parallexLevel;
        if(zIndex){
            this.node.zIndex = zIndex;
        };
        this.node.scale = scale;
        if(anchor){
            this.node.anchorX = anchor.x;
            this.node.anchorY = anchor.y;
        }
        let sprite = this.getComponent(cc.Sprite);
        sprite.spriteFrame = Logic.spriteFrameRes(resName);
        this.node.width = sprite.spriteFrame.getOriginalSize().width;
        this.node.height = sprite.spriteFrame.getOriginalSize().height;
        this.node.opacity = opacity?opacity:255;
        this.originPos = this.node.position.clone();
    }
    update(dt:number){
        if(this.dungeon&&this.parallexLevel>0){
            let pos = this.dungeon.player.node.position.sub(this.node.position);
            if(pos.x>this.RANGE){
                pos.x = this.RANGE;
            }
            if(pos.x<-this.RANGE){
                pos.x = -this.RANGE;
            }
            if(pos.y>this.RANGE){
                pos.y = this.RANGE;
            }
            if(pos.y<-this.RANGE){
                pos.y = -this.RANGE;
            }
            let p = cc.v3(pos.x/this.RANGE*Dungeon.TILE_SIZE*this.parallexLevel,-pos.y/this.RANGE*Dungeon.TILE_SIZE*this.parallexLevel/2);
            this.node.position = Logic.lerpPos(this.node.position,this.originPos.add(p),dt*5);
        }
    }
}
