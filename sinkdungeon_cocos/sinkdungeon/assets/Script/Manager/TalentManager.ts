import Status from "../Status";
import Logic from "../Logic";
import { EventConstant } from "../EventConstant";
import TalentData from "../Data/TalentData";
import Dungeon from "../Dungeon";

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
export default class TalentManager extends cc.Component {
    public static readonly DASH_01 = 1000001;
    public static readonly DASH_02 = 1000002;
    public static readonly DASH_03 = 1000003;
    public static readonly DASH_04 = 1000004;
    public static readonly DASH_05 = 1000005;
    public static readonly DASH_06 = 1000006;
    public static readonly DASH_07 = 1000007;
    public static readonly DASH_08 = 1000008;
    public static readonly DASH_09 = 1000009;
    public static readonly DASH_10 = 1000010;
    public static readonly DASH_11 = 1000011;
    public static readonly DASH_12 = 1000012;
    public static readonly DASH_13 = 1000013;
    public static readonly DASH_14 = 1000014;

    
    
    private talentList: TalentData[];
    dugeon:Dungeon;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.talentList = new Array();
    }

    start() {

    }
    addTalent(id:number) {
        if(id<1){
            return;
        }
        let td = new TalentData();
        td.id = id;
        let hasTalent = false;
        for (let i = this.talentList.length - 1; i >= 0; i--) {
            let s = this.talentList[i];
            if (s.id==td.id) {
                hasTalent = true;
                break;
            }
        }
        if(!hasTalent){
            this.talentList.push(td);
        }
    }
}
