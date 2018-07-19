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
export default class MonsterData{
    name:string = '';
    currentHealth:number=0;
    maxHealth:number=0;
    attackPoint:number=0;
    pos:cc.Vec2 = cc.v2(0,0);
    monsterType:number = 0;
    updateHAT(currentHealth:number,maxHealth:number,attackPoint:number,monsterType:number){
        this.currentHealth = currentHealth;
        this.maxHealth = maxHealth;
        this.attackPoint = attackPoint;
        this.monsterType = monsterType;
    }
}
