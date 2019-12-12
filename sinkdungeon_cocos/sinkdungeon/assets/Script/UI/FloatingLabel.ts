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
export default class FloatingLabel extends cc.Component {

    anim:cc.Animation;
    text:string;
    label:cc.Label;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.anim = this.getComponent(cc.Animation);
        this.label = this.node.getChildByName('label').getComponent(cc.Label);
    }

    start () {

    }
    showLabel(text:string,color:cc.Color,scale:number){
        if(scale){
            if(scale>3){
                scale = 3;
            }
            this.node.scale = scale;
        }
        this.label.node.opacity = 255;
        this.label.node.position = cc.v2(0,0);
        this.label.string = text;
        this.label.node.color = color;
        this.anim.play('FontFloating');
    }
    showMiss(){
        this.showLabel('丢失',cc.color(255, 255, 255),0.75);
    }
    showDoge(){
        this.showLabel('闪避',cc.color(255, 255, 255),0.75);
    }
    showDamage(damage:number,isCritical:boolean){
        let color = damage < 0 ? cc.color(255, 0, 0) : cc.color(0, 255, 0);
        if(isCritical){
            color = cc.color(255,255,0);
        }
        this.showLabel(`${damage>0?'+':''}${parseFloat((damage).toFixed(1))}`,color,1+Math.abs(damage/50));
    }

    hideLabel(){
        this.node.active = false;
        cc.director.emit('destorylabel',{detail:{labelNode:this.node}});
    }
    //Anim
    FloatingFinish(){
        this.hideLabel();
    }
    // update (dt) {}
}
