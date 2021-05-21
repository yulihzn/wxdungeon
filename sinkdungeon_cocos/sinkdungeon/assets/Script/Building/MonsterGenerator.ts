// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ColliderTag } from "../Actor/ColliderTag";
import Dungeon from "../Dungeon";
import Logic from "../Logic";
import IndexZ from "../Utils/IndexZ";
import Building from "./Building";

const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class MonsterGenerator extends Building {
    anim: cc.Animation;
    dungeon:Dungeon;    
    canAdd = false;
    addFinish = false;
    count = 0;
    addDelay = 2;
    init(dungeon:Dungeon,generatorInterval:number,generatorCount:number,generatorList:string[]){
        this.dungeon = dungeon;
        this.data.generatorCount = generatorCount;
        this.data.generatorInterval = generatorInterval;
        this.data.generatorList = generatorList;
        this.node.zIndex = IndexZ.getActorZIndex(this.node.position.clone().add(cc.v3(0,120)));
        let isReborn = Logic.mapManager.getCurrentRoom().isReborn;
        let data = Logic.mapManager.getCurrentMapBuilding(this.data.defaultPos);
        if (data) {
            this.data.isOpen = data.isOpen;
            if(isReborn){
                this.data.isOpen = false;
            }
        } else {
            Logic.mapManager.setCurrentBuildingData(this.data.clone());
        }
        this.anim = this.getComponent(cc.Animation);
        this.addFinish = this.data.isOpen;
    }

    timeDelay = 0;
    isTimeDelay(dt: number): boolean {
        this.timeDelay += dt;
        if (this.timeDelay > this.data.generatorInterval) {
            this.timeDelay = 0;
            return true;
        }
        return false;
    }
    update(dt: number) {
        if (this.isTimeDelay(dt)) {
            this.addMonster();
        }
    }
    addMonster():boolean {
        if (this.count >= this.data.generatorInterval) {
            this.addFinish = true;
            return false;
        }
        if (!this.canAdd) {
            return false;
        }
        return true;
    }
    showMonster() {
        let pos = Dungeon.getIndexInMap(this.node.position.clone());
        this.dungeon.monsterManager.addMonsterFromData(this.data.generatorList[Logic.getRandomNum(0, this.data.generatorList.length - 1)], pos, this.dungeon, true);
        this.count++;
    }
    open() {
        if (this.data.isOpen) {
            return false;
        }
        this.data.isOpen = true;
        this.scheduleOnce(()=>{this.canAdd = true;},this.addDelay);
        let saveWentLine = Logic.mapManager.getCurrentMapBuilding(this.data.defaultPos);
        if (saveWentLine) {
            saveWentLine.isOpen = this.data.isOpen;
        } else {
            Logic.mapManager.setCurrentBuildingData(this.data.clone());

        }
        return true;

    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (!this.data.isOpen && other.tag == ColliderTag.PLAYER) {
            this.open();
        }
    }
}
