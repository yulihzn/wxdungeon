import Actor from "../Base/Actor";
import DamageData from "../Data/DamageData";
import FromData from "../Data/FromData";
import BuildingData from "../Data/BuildingData";
import StatusData from "../Data/StatusData";

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
export abstract default class Building extends Actor {
    data:BuildingData = new BuildingData();
    takeDamage(damage: DamageData):boolean{
        return false;
    }
    addStatus(statusType: string, from: FromData) {
    }
    getCenterPosition(): cc.Vec3 {
        return this.node.position.clone();
    }
    actorName(){
        return '';
    }
    takeDizz(dizzDuration: number):void{

    }

    updateStatus(statusList:StatusData[],totalStatusData:StatusData): void {
    }
    hideSelf(hideDuration: number): void {
    }
    updateDream(offset: number): number {
        return 0;
    }
    setLinearVelocity(movement: cc.Vec2){

    }
}
