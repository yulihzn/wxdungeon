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
    indexPos:cc.Vec3;//下标,x代表横向下标，y代表纵向下标，y决定Actor攻击判定，当受击框的y在攻击框的y范围则代表碰撞有效，其中z代表高度
}
