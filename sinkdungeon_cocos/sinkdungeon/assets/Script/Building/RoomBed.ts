import ExitData from "../Data/ExitData";
import FromData from "../Data/FromData";
import Dungeon from "../Dungeon";
import ShadowOfSight from "../Effect/ShadowOfSight";
import { EventHelper } from "../EventHelper";
import Logic from "../Logic";
import StatusManager from "../Manager/StatusManager";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from "../Player";
import Tips from "../UI/Tips";
import AudioPlayer from "../Utils/AudioPlayer";
import Building from "./Building";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RoomBed extends Building {

    isWakeUp = false;
    dungeon:Dungeon;
    isFirst = true;
    isDecorate = false;
    tips: Tips;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.lights = this.getComponentsInChildren(ShadowOfSight);
        this.tips = this.getComponentInChildren(Tips);
        this.tips.onInteract((isLongPress:boolean,player:Player)=>{
            if (this.node) {
                this.enterDream(player);
            }
        });
    }

    init(dungeon:Dungeon,isDecorate:boolean){
        this.dungeon = dungeon;
        this.isDecorate = isDecorate;
        this.tips.node.active = !isDecorate;
    }
    start () {
        this.node.getChildByName('sprite').getChildByName('bed').getComponent(cc.Sprite).spriteFrame = Logic.spriteFrameRes(`avatarbed00${Logic.playerData.AvatarData.organizationIndex}`);
        this.node.getChildByName('sprite').getChildByName('cover').getComponent(cc.Sprite).spriteFrame = Logic.spriteFrameRes(`avatarcover00${Logic.playerData.AvatarData.organizationIndex}`);
        for (let light of this.lights) {
            light.updateRender(!this.isDecorate);
        }
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if(this.isDecorate){
            return;
        }
        let player = other.node.getComponent(Player);
        this.enterDream(player);
    }
    enterDream(player:Player){
        if (player&&!this.isWakeUp&&this.isFirst) {
            this.isFirst = false;
            if(this.dungeon){
                this.dungeon.CameraZoom = Dungeon.DEFAULT_ZOOM_MAX;
            }
            player.addStatus(StatusManager.DIZZ,new FromData());
            this.scheduleOnce(()=>{
                Logic.playerData = player.data.clone();
                if(Logic.playerData.pos.equals(this.data.defaultPos)){
                    Logic.playerData.pos.y=this.data.defaultPos.y-1;
                }
                AudioPlayer.play(AudioPlayer.EXIT);
                Logic.loadingNextLevel(ExitData.getDreamExitDataFromReal());
            },0.5)
        }
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        if(this.isDecorate){
            return;
        }
        let player = other.node.getComponent(Player);
        if (player&&!this.isWakeUp) {
            this.isWakeUp = true;
        }
    }
    // update (dt) {}
}
