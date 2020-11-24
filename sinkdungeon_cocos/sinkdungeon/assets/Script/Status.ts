import { EventHelper } from "./EventHelper";
import StatusData from "./Data/StatusData";
import Logic from "./Logic";
import Player from "./Player";
import DamageData from "./Data/DamageData";
import Monster from "./Monster";
import Boss from "./Boss/Boss";
import NonPlayer from "./NonPlayer";

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
        this.doStatusDamage(true);
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
    
    private doStatusDamage(isDirect:boolean){
        if(!this.target||!this.data){
            return;
        }
        let dd = isDirect?this.getDamageDirect():this.getDamageOverTime();
        let dizzDuration = isDirect?this.data.dizzDurationDirect:this.data.dizzDurationOvertime;
        let player = this.target.getComponent(Player);
        let takeD = dd.getTotalDamage() != 0;
        if(player){
            if(takeD){player.takeDamage(dd,this.data.From);}
            player.dizzCharacter(dizzDuration);
            if(this.data.invisibleDuratonDirect){
                player.hideCharacter(this.data.invisibleDuratonDirect);
            }
            return;
        }
        let non = this.target.getComponent(NonPlayer);
        if(non){
            if(takeD){non.takeDamage(dd);}
            non.dizzCharacter(dizzDuration);
            return;
        }
        let monster = this.target.getComponent(Monster);
        if(monster){
            if(takeD){monster.takeDamage(dd);}
            monster.dizzCharacter(dizzDuration);
            return;
        }
        //boss免疫眩晕
        let boss = this.target.getComponent(Boss);
        if(boss){
            if(takeD){boss.takeDamage(dd);}
            return;
        }
    }
  
    update (dt) {
        this.label.string = `${this.data.duration>0?this.data.duration:''}`;
        this.label.node.opacity = this.data.duration <0||this.data.duration >500?0:255;
        if(this.isTimeDelay(dt)){
            if(this.data.duration > 0){
                if(this.data.duration != -1){
                    this.data.duration--;
                }
                this.doStatusDamage(false);
            }
            if(this.data.duration  == 0  && this.stateRunning){
                this.stateRunning = false;
                this.anim.play('StatusHide');
                this.scheduleOnce(()=>{if(this.node){
                    this.node.destroy();
                }},0.5);
            }
        }
    }
    getDamageDirect():DamageData{
        let dd = new DamageData();
        dd.realDamage = this.data.realDamageDirect?this.data.realDamageDirect:0;
        dd.physicalDamage = this.data.physicalDamageDirect?this.data.physicalDamageDirect:0;
        dd.magicDamage = this.data.magicDamageDirect?this.data.magicDamageDirect:0;
        return dd;
    }
    getDamageOverTime():DamageData{
        let dd = new DamageData();
        dd.realDamage = this.data.realDamageOvertime?this.data.realDamageOvertime:0;
        dd.physicalDamage = this.data.physicalDamageOvertime?this.data.physicalDamageOvertime:0;
        dd.magicDamage = this.data.magicDamageOvertime?this.data.magicDamageOvertime:0;
        return dd;
    }
}
