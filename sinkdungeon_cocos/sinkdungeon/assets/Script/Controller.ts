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
import {EventConstant} from './EventConstant';

@ccclass
export default class Controller extends cc.Component {

    @property(cc.Node)
    player: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let ss = this.node.getComponentsInChildren(cc.Sprite);
        for(let i = 0;i < ss.length;i++){
            ss[i].spriteFrame.getTexture().setAliasTexParameters();
        }
    }

    start () {
    }
    move(event, dir){
        dir = parseInt(dir);
        cc.director.emit(EventConstant.PLAYER_MOVE,{dir})
    }
    actionCenter(event, customEventData){
        cc.director.emit(EventConstant.PLAYER_USEITEM);
    }
    

    // update (dt) {}
}
