// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventHelper } from "../EventHelper";
import AudioPlayer from "../Utils/AudioPlayer";
import CellphoneDialog from "./dialog/CellphoneDialog";



const { ccclass, property } = cc._decorator;

@ccclass
export default class Cellphone extends cc.Component {
    @property(CellphoneDialog)
    dialog:CellphoneDialog = null;
    anim:cc.Animation;
    isOpen = false;
    onLoad() {
        this.anim = this.getComponent(cc.Animation);
        EventHelper.on(EventHelper.HUD_CELLPHONE_SHOW
            , (detail) => {
                if (this.node) {
                    if(!this.isOpen){
                        AudioPlayer.play(AudioPlayer.SELECT);
                        this.anim.play('CellphoneShow');
                    }
                }
            });
        this.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            if(!this.isOpen){
                AudioPlayer.play(AudioPlayer.SELECT);
                this.anim.play('CellphoneShow');
            }
        }, this);
        this.dialog.onDismissListener(()=>{
            this.anim.play('CellphoneHide');
        });
    }
    //anim
    Show(){
        this.dialog.show();
    }
    //anim
    Hide(){
        this.isOpen = false;
    }
    
}