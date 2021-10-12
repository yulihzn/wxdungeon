// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventHelper } from "../logic/EventHelper";




const { ccclass, property } = cc._decorator;

@ccclass
export default class Toast extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;
    onLoad() {
        EventHelper.on(EventHelper.HUD_TOAST
            , (detail) => {
                if (this.node) {
                    this.showToast(detail.msg,detail.isCenter,detail.isTap);
                }
            });
        this.node.active = false;
    }
    showToast(msg: string,isCenter:boolean,isTap:boolean) {
        if(msg.length<1){
            return;
        }
        this.label.node.width = isCenter?300:600;
        let node = this.node;
        node.stopAllActions();
        let delay = 1.5;
        if(isTap){
            delay = 0.05*msg.length;
            if(delay<1.5){
                delay = 1.5;
            }
            let count = 0;
            this.schedule(()=>{
                this.label.string = `${msg.substr(0,count++)}`;
                node.width = this.label.node.width + 10;
                node.height = this.label.node.height + 10;
                node.opacity = 255;
                node.active = true;
            },0.05,msg.length,0.3)
        }else{
            this.scheduleOnce(()=>{
                this.label.string = `${msg}`;
                node.width = this.label.node.width + 10;
                node.height = this.label.node.height + 10;
                node.opacity = 255;
                node.active = true;
            },0.05)
            
        }
        
        let y = isCenter?360:100;
        node.y = y-100;
        node.scale = 0;
        cc.tween(node).to(0.1, { scaleX: 1 }).to(0.1, { scaleY: 1 }).to(0.2, { y: y }).delay(delay).call(() => {
            cc.tween(node).to(0.1, { scaleY: 0.1 }).to(0.1, { scaleX: 0 }).to(0.1, { opacity: 0 }).call(() => {
                node.active = false;
            }).start();

        }).start();
    }

}
