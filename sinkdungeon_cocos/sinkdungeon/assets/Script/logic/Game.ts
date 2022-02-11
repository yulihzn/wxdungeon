import Dungeon from "./Dungeon";
import Logic from "./Logic";
import GameHud from "../ui/GameHud";
import LocalStorage from "../utils/LocalStorage";

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
export default class Game extends cc.Component {
    private dungeonBase:Dungeon
    private hudBase:GameHud
    onLoad(){
        Logic.settings.showSoftShadow = LocalStorage.isSwitchOpen(LocalStorage.KEY_SWITCH_SHOW_SOFT_SHADOW);
        Logic.settings.showGamepad = LocalStorage.isSwitchOpen(LocalStorage.KEY_SWITCH_SHOW_GAMEPAD);
        Logic.settings.showEquipDialog = LocalStorage.isSwitchOpen(LocalStorage.KEY_SWITCH_SHOW_EQUIPDIALOG);
        cc.director.getScheduler().setTimeScale(1);
    }
    get Dungeon(){
        if(!this.dungeonBase){
            this.dungeonBase = this.getComponentInChildren(Dungeon);
        }
        return this.dungeonBase;
    }
    get hud(){
        if(!this.hudBase){
            this.hudBase = this.getComponentInChildren(GameHud);
        }
        return this.hudBase;
    }
    update(dt){
        this.node;
    }
}
