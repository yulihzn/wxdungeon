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
export default class PlayerData {
    static DEFAULT_HEALTH = 5;
    name:string = '';
    currentHealth:number=PlayerData.DEFAULT_HEALTH;
    maxHealth:number=PlayerData.DEFAULT_HEALTH;
    attackPoint:number=1;
    pos:cc.Vec2 = cc.v2(0,0);
    updateHA(currentHealth:number,maxHealth:number,attackPoint:number){
        this.currentHealth = currentHealth;
        this.maxHealth = maxHealth;
        this.attackPoint = attackPoint;
        return this;
    }
}
