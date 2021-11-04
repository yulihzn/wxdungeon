// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CCollider from "../collider/CCollider";
import Dungeon from "../logic/Dungeon";
import Logic from "../logic/Logic";
import NonPlayer from "../logic/NonPlayer";
import IndexZ from "../utils/IndexZ";
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
    nonplayerlist:NonPlayer[] = []
    init(dungeon:Dungeon,generatorInterval:number,generatorCount:number,generatorList:string[]){
        this.dungeon = dungeon;
        this.data.generatorCount = generatorCount;
        this.data.generatorInterval = generatorInterval;
        this.data.generatorList = generatorList;
        this.node.zIndex = IndexZ.getActorZIndex(this.entity.Transform.position.clone().add(cc.v3(0,120)));
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

    checkTimeDelay = 0;
    isTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > this.data.generatorInterval) {
            this.checkTimeDelay = 0;
            return true;
        }
        return false;
    }
    update(dt: number) {
        if(Logic.isGamePause){
            return;
        }
        if (this.isTimeDelay(dt)) {
            this.addMonster();
            
        }
    }
    addMonster():boolean {
        if (this.count >= this.data.generatorCount) {
            this.addFinish = true;
            return false;
        }
        if (!this.canAdd) {
            return false;
        }
        return true;
    }
    showMonster() {
        let pos = Dungeon.getIndexInMap(this.entity.Transform.position.clone());
        this.nonplayerlist.push(this.dungeon.monsterManager.addMonsterFromData(this.data.generatorList[Logic.getRandomNum(0, this.data.generatorList.length - 1)], pos, this.dungeon, true));
        this.count++;
    }
    open() {
        if (this.data.isOpen) {
            return false;
        }
        this.data.isOpen = true;
        this.scheduleOnce(()=>{this.canAdd = true;},this.addDelay);
        let savedata = Logic.mapManager.getCurrentMapBuilding(this.data.defaultPos);
        if (savedata) {
            savedata.isOpen = this.data.isOpen;
        } else {
            Logic.mapManager.setCurrentBuildingData(this.data.clone());
        }
        return true;

    }
    onColliderEnter(other: CCollider, self: CCollider) {
        if (!this.data.isOpen && other.tag == CCollider.TAG.PLAYER) {
            this.open();
        }
    }
}
