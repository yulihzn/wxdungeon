// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import FromData from "../data/FromData";
import Dungeon from "../Dungeon";
import StatusManager from "../manager/StatusManager";
import AudioPlayer from "../utils/AudioPlayer";
import IndexZ from "../utils/IndexZ";
import Building from "./Building";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoomStool extends Building {
    @property(cc.Node)
    mosaic: cc.Node = null;
    isOpen = false;
    dungeon:Dungeon;

    onLoad() {
      
    }
    init(indexPos:cc.Vec3,dungeon:Dungeon) {
        this.dungeon = dungeon;
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
        if(this.dungeon){
            this.dungeon.player.addStatus(StatusManager.DIZZ_LONG,new FromData());
        }
        this.scheduleOnce(() => {
            this.mosaic.opacity = 0;
            AudioPlayer.play(AudioPlayer.CLOSESTOOL);
        }, 5);
        this.scheduleOnce(() => { this.isOpen = false; }, 10)
    }
}
