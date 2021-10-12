import BaseManager from "../manager/BaseManager";
import CustomCollider from "./CustomCollider";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ColliderManager extends BaseManager {
    private static list: CustomCollider[] = [];

    clear(): void {
        ColliderManager.list = [];
    }
    onLoad() {
    }
    
    public static registerCollider(colliders: CustomCollider[]) {
        for (let collider of colliders) {
            ColliderManager.list.push(collider);
        }
    }
    public static unRegisterCollider(collider: CustomCollider) {
        let index = ColliderManager.list.indexOf(collider);
        if (-1 != index) {
            ColliderManager.list.splice(index, 1);
        }
    }
    
    checkTimeDelay = 0;
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > 0.05) {
            this.checkTimeDelay = 0;
            return true;
        }
        return false;
    }
    update(dt: number) {
        
    }
}
