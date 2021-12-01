// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import AudioPlayer from "../../utils/AudioPlayer";
import BaseDialog from "./BaseDialog";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NoticeDialog extends BaseDialog {
    
    onLoad () {
    }

    start () {

    }
    show(){
        super.show();
        
    }
    // update (dt) {}
    close(){
        AudioPlayer.play(AudioPlayer.SELECT);
        this.dismiss();
    }
}
