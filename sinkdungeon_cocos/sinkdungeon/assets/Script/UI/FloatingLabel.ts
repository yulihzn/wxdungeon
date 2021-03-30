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
        let sc = this.node.scale;
        this.node.scale = sc*1.5;
        this.label.node.opacity = 255;
        this.label.node.position = cc.v3(0,0);
        this.label.string = text;
        this.label.node.color = color;
        this.anim.play('FontFloating');
        cc.tween(this.node).to(0.1,{scale:sc}).start();
    }
    showMiss(){
        this.showLabel('丢失',cc.color(255, 255, 255),1);
    }
    showDoge(){
        this.showLabel('闪避',cc.color(255, 255, 255),1);
    }
    showDamage(damage:number,isCritical:boolean,isBackStab?:boolean){
        let color = damage < 0 ? cc.color(255, 0, 0) : cc.color(0, 255, 0);
        
        let baseScale = 1;
        if(isCritical){
            color = cc.color(255,255,0);
            baseScale = 2;
        }
        if(isBackStab){
            color = cc.color(186,85,211);
        }
        this.showLabel(`${damage>0?'+':''}${parseFloat((damage).toFixed(1))}`,color,baseScale+Math.abs(damage/50));
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
