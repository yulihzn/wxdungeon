// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventHelper } from "../EventHelper";
import Tips from "../UI/Tips";
import AudioPlayer from "../Utils/AudioPlayer";
import IndexZ from "../Utils/IndexZ";
import Building from "./Building";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoomStool extends Building {
    @property(cc.Node)
    mosaic: cc.Node = null;
    tips: Tips;
    isOpen = false;

    onLoad() {
        this.tips = this.getComponentInChildren(Tips);
        cc.director.on(EventHelper.PLAYER_TAPTIPS
            , (event) => {
                if (this.node && event.detail.tipsType == Tips.ROOM_STOOL + `x=${this.data.defaultPos.x}y=${this.data.defaultPos.y}`) {
                    this.open();
                }
            });
    }
    init(indexPos:cc.Vec3) {
        if(this.tips){
            this.tips.tipsType = Tips.ROOM_STOOL+`x=${indexPos.x}y=${indexPos.y}`;
        }
        this.data.defaultPos = indexPos;
        let p = this.mosaic.convertToWorldSpaceAR(cc.v3(0, 0));
        this.mosaic.parent = this.node.parent;
        this.mosaic.position = this.mosaic.parent.convertToNodeSpaceAR(p);
        this.mosaic.zIndex = IndexZ.OVERHEAD;
        this.mosaic.opacity = 0;
    }

    open() {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;
        this.mosaic.opacity = 255;
        this.unscheduleAllCallbacks();
        this.scheduleOnce(() => {
            this.mosaic.opacity = 0;
            AudioPlayer.play(AudioPlayer.CLOSESTOOL);
        }, 5);
        this.scheduleOnce(() => { this.isOpen = false; }, 10)
    }
}
