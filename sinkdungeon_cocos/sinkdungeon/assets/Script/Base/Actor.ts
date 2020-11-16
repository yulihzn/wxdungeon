import DamageData from "../Data/DamageData";
import FromData from "../Data/FromData";
import Dungeon from "../Dungeon";
import Logic from "../Logic";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
// 地图里的所有建筑生物道具都是由Actor组成的
const {ccclass, property} = cc._decorator;

@ccclass
export default abstract class Actor extends cc.Component {
    static readonly TARGET_PLAYER = 0;
    static readonly TARGET_MONSTER = 1;
    static readonly TARGET_BOSS = 2;
    static readonly TARGET_NONPLAYER = 3;
    static readonly TARGET_NONPLAYER_ENEMY = 4;
    abstract takeDamage(damage: DamageData): boolean;
    abstract actorName():string;
    abstract addStatus(statusType: string, from: FromData);

    getNearestTargetPosition(targetTypes:number[],dungeon:Dungeon): cc.Vec3 {
        let targetNode: cc.Node = this.getNearestTargetNode(targetTypes,dungeon);
        if (targetNode) {
            return targetNode.position;
        }
        return this.node.position.addSelf(cc.v3(Logic.getRandomNum(0, 600) - 300, Logic.getRandomNum(0, 600) - 300));
    }
    getNearestTargetNode(targetTypes:number[],dungeon:Dungeon): cc.Node {
        for(let targetType of targetTypes){
            if(targetType == Actor.TARGET_PLAYER){
                return dungeon.player.node;
            }else if(targetType == Actor.TARGET_MONSTER){

            }else if(targetType == Actor.TARGET_BOSS){

            }else if(targetType == Actor.TARGET_NONPLAYER){

            }else if(targetType == Actor.TARGET_NONPLAYER_ENEMY){

            }
        }
        let shortdis = 99999;
        let targetNode: cc.Node;
        for (let monster of dungeon.monsterManager.monsterList) {
            if (!monster.isDied) {
                let dis = Logic.getDistance(this.node.position, monster.node.position);
                if (dis < shortdis) {
                    shortdis = dis;
                    targetNode = monster.node;
                }
            }
        }
        for (let boss of dungeon.monsterManager.bossList) {
            if (!boss.isDied) {
                let dis = Logic.getDistance(this.node.position, boss.node.position);
                if (dis < shortdis) {
                    shortdis = dis;
                    targetNode = boss.node;
                }
            }
        }
        if (targetNode) {
            return targetNode;
        }
        return null;
    }
    getNearestTargetDistance(playerNode: cc.Node): number {
        let dis = Logic.getDistance(this.node.position, playerNode.position);
        return dis;
    }
}
