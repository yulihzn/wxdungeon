import MeleeWeapon from "./MeleeWeapon";

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
export default class MeleeWeaponChild extends cc.Component {

    meleeWeapon: MeleeWeapon = null;
    // isAttacking = false;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.getComponent(cc.Sprite).spriteFrame;
    }

    start () {

    }
    // onCollisionEnter(other: cc.Collider, self: cc.Collider) {
    //     if(this.meleeWeapon&& !this.isAttacking){
    //         this.meleeWeapon.attacking(other);
    //     }
    // }
    // onCollisionStay(other: cc.Collider, self: cc.Collider) {
    //     if(this.meleeWeapon && !this.isAttacking){
    //         this.meleeWeapon.attacking(other);
    //     }
    // }
    
}
