import TalentMagic from "./TalentMagic";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class MagicCircle extends cc.Component {

    anim:cc.Animation;
    talentMaigc:TalentMagic;
    isShow = false;
    private spellNow = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    playMagic (spellNow:boolean) {
        if(!this.anim){
            this.anim = this.getComponent(cc.Animation);
        }
        this.anim.play();
        this.anim.getAnimationState('PlayerMagicShow').speed = 2;
        this.isShow = true;
        this.spellNow = spellNow;
        if(spellNow){
            if(this.talentMaigc){
                this.talentMaigc.MagicFinish();
            }
        }
    }
    //anim
    MagicFinish(){
        if(!this.spellNow&&this.talentMaigc){
            this.talentMaigc.MagicFinish();
        }
        this.isShow = false;
    }

    // update (dt) {}
}
