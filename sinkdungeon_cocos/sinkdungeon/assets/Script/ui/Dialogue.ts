// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Trap from "../building/Trap";
import DialogueData from "../data/DialogueData";
import { EventHelper } from "../logic/EventHelper";




const { ccclass, property } = cc._decorator;

@ccclass
export default class Dialogue extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;
    @property(cc.Node)
    next:cc.Node = null;
    @property(cc.Node)
    topbg:cc.Node = null;
    @property(cc.Node)
    bottombg:cc.Node = null;
    @property(cc.Sprite)
    avatarSprite:cc.Sprite = null;
    @property(cc.Node)
    buttonLayout:cc.Node = null;
    @property(cc.Button)
    button0:cc.Button = null;
    @property(cc.Button)
    button1:cc.Button = null;
    @property(cc.Button)
    button2:cc.Button = null;
    @property(cc.Button)
    button3:cc.Button = null;
    anim:cc.Animation = null;
    onLoad() {
        EventHelper.on(EventHelper.HUD_NARRATOR_SHOW
            , (detail) => {
                if (this.node) {
                    this.show(detail.data);
                }
            });
        this.node.active = false;
        this.anim = this.getComponent(cc.Animation);
        this.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            this.tap();
        }, this)
    }
    private show(data:DialogueData){
        this.node.active = true;
        this.anim.play('DialogueShow');
    }
    private hide(){
        this.node.active = false;
        this.anim.play('DialogueHide');
    }
    //Anim
    ShowFinish(){
        this.playDialogue();
    }
    HideFinish(){
        this.node.active = false;
    }
    private tap(){

    }
    private playDialogue(){

    }
    showToast(msg: string,isCenter:boolean,isTap:boolean) {
        if(msg.length<1){
            return;
        }
        this.label.node.width = isCenter?300:600;
        let node = this.node;
        node.stopAllActions();
        let delay = 3;
        if(isTap){
            delay = 0.07*msg.length;
            if(delay<3){
                delay = 3;
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
