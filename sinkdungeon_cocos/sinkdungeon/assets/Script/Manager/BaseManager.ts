import Dungeon from "../Dungeon";
import Logic from "../Logic";
import FootBoard from "../Building/FootBoard";
import IndexZ from "../Utils/IndexZ";
import Saw from "../Building/Saw";
import Emplacement from "../Building/Emplacement";
import DecorationFloor from "../Building/DecorationFloor";
import Chest from "../Building/Chest";
import Box from "../Building/Box";
import Decorate from "../Building/Decorate";
import ShopTable from "../Building/ShopTable";
import FallStone from "../Building/FallStone";
import MagicLightening from "../Building/MagicLightening";
import HitBuilding from "../Building/HitBuilding";
import ExitDoor from "../Building/ExitDoor";
import Door from "../Building/Door";
import Wall from "../Building/Wall";
import AirExit from "../Building/AirExit";
import LevelData from "../Data/LevelData";
import Portal from "../Building/Portal";
import RoomBed from "../Building/RoomBed";
import Building from "../Building/Building";
import ExitData from "../Data/ExitData";


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
export default abstract class BaseManager extends cc.Component {
    abstract clear():void;
}
