import { EventConstant } from "./EventConstant";
import StatusData from "./Data/StatusData";
import Logic from "./Logic";
import Player from "./Player";
import DamageData from "./Data/DamageData";
import Monster from "./Monster";

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
export default class Status extends cc.Component {
    anim:cc.Animation;
    label:cc.Label;
    private stateRunning:boolean = false;
    sprite:cc.Sprite = null;
    data:StatusData = new StatusData();
    target:cc.Node;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
        this.label = this.node.getChildByName('sprite').getChildByName('label').getComponent(cc.Label);
        this.anim = this.getComponent(cc.Animation);
    }

    start () {
    }
    showStatus(target:cc.Node,data:StatusData){
        if(!this.anim){return;}
        this.target = target;
        this.data = data;
        this.sprite.spriteFrame = Logic.spriteFrames[data.spriteFrameName];
        this.anim.playAdditive('StatusShow');
        this.doStatusDamge(true);
        this.stateRunning = true;
        
    }
    stopStatus(){
        this.data.duration = 0;
        if(this.stateRunning){
            this.node.destroy();
        }
    }
    isStatusRunning():boolean{
        return this.data.duration>0||this.data.duration == -1;
    }
    delayTime = 0;
    private isTimeDelay(dt: number): boolean {
        this.delayTime += dt;
        if (this.delayTime > 1) {
            this.delayTime = 0;
            return true;
        }
        return false;
    }
    
    private doStatusDamge(isDirect:boolean){
        if(!this.target||!this.data){
            return;
        }
        let dd = isDirect?this.getDamgeDirect():this.getDamgeOverTime();
        let player = this.target.getComponent(Player);
        if(player){
            player.takeDamage(dd)
            return;   
        }
        let monster = this.target.getComponent(Monster);
        if(monster){
            monster.takeDamage(dd);
            return;
        }
    }
  
    update (dt) {
        this.label.string = `${this.data.duration}`;
        this.label.node.opacity = this.data.duration == -1?0:255;
        if(this.isTimeDelay(dt)){
            if(this.data.duration > 0){
                if(this.data.duration != -1){
                    this.data.duration--;
                }
                this.doStatusDamge(false);
            }
            if(this.data.duration  == 0  && this.stateRunning){
                this.stateRunning = false;
                this.anim.play('StatusHide');
                setTimeout(()=>{if(this.node){
                    this.node.destroy();
                }},500);
            }
        }
    }
    getDamgeDirect():DamageData{
        let dd = new DamageData();
        dd.realDamge = this.data.realDamgeDirect?this.data.realDamgeDirect:0;
        dd.physicalDamage = this.data.physicalDamageDirect?this.data.physicalDamageDirect:0;
        dd.iceDamage = this.data.iceDamageDirect?this.data.iceDamageDirect:0;
        dd.fireDamage = this.data.fireDamageDirect?this.data.fireDamageDirect:0;
        dd.lighteningDamage = this.data.lighteningDamageDirect?this.data.lighteningDamageDirect:0;
        dd.toxicDamage = this.data.toxicDamageDirect?this.data.toxicDamageDirect:0;
        dd.curseDamage = this.data.curseDamageDirect?this.data.curseDamageDirect:0;
        return dd;
    }
    getDamgeOverTime():DamageData{
        let dd = new DamageData();
        dd.realDamge = this.data.realDamgeOvertime?this.data.realDamgeOvertime:0;
        dd.physicalDamage = this.data.physicalDamageOvertime?this.data.physicalDamageOvertime:0;
        dd.iceDamage = this.data.iceDamageOvertime?this.data.iceDamageOvertime:0;
        dd.fireDamage = this.data.fireDamageOvertime?this.data.fireDamageOvertime:0;
        dd.lighteningDamage = this.data.lighteningDamageOvertime?this.data.lighteningDamageOvertime:0;
        dd.toxicDamage = this.data.toxicDamageOvertime?this.data.toxicDamageOvertime:0;
        dd.curseDamage = this.data.curseDamageOvertime?this.data.curseDamageOvertime:0;
        return dd;
    }
}
