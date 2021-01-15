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
import AudioPlayer from "../Utils/AudioPlayer";
import Building from "./Building";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RoomBed extends Building {

    isWakeUp = false;
    dungeon:Dungeon;
    isFirst = true;
    isDecorate = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.light = this.getComponentInChildren(ShadowOfSight);
    }

    init(dungeon:Dungeon,isDecorate:boolean){
        this.dungeon = dungeon;
        this.isDecorate = isDecorate;
    }
    start () {
        this.node.getChildByName('sprite').getChildByName('bed').getComponent(cc.Sprite).spriteFrame = Logic.spriteFrameRes(`avatarbed00${Logic.playerData.AvatarData.organizationIndex}`);
        this.node.getChildByName('sprite').getChildByName('cover').getComponent(cc.Sprite).spriteFrame = Logic.spriteFrameRes(`avatarcover00${Logic.playerData.AvatarData.organizationIndex}`);
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if(this.isDecorate){
            return;
        }
        let player = other.node.getComponent(Player);
        if (player&&!this.isWakeUp&&this.isFirst) {
            this.isFirst = false;
            if(this.dungeon){
                this.dungeon.CameraZoom = 2;
            }
            player.addStatus(StatusManager.DIZZ,new FromData());
            this.scheduleOnce(()=>{
                Logic.playerData = player.data.clone();
                if(Logic.playerData.pos.equals(this.data.defaultPos)){
                    Logic.playerData.pos.y=this.data.defaultPos.y-1;
                }
                cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.EXIT } });
                Logic.loadingNextLevel(ExitData.getDreamExitDataFromReal(),true);
            },1)
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
