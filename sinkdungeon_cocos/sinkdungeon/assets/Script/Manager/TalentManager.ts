import Logic from "../Logic";
import Dungeon from "../Dungeon";
import DungeonStyleData from "../Data/DungeonStyleData";
import ParallexBackground from "../UI/ParallaxBackground";
import IndexZ from "../Utils/IndexZ";
import LevelData from "../Data/LevelData";
import BaseManager from "./BaseManager";
import Talent from "../Talent/Talent";
import ProfessionTalent from "../Talent/ProfessionTalent";
import OrganizationTalent from "../Talent/OrganizationTalent";
import Player from "../Player";

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
export default class TalentManager extends BaseManager {
    private professionTalent: ProfessionTalent;
    private organizationTalent:OrganizationTalent;
    get profession(){
        return this.professionTalent;
    }
    get organization(){
        return this.organizationTalent;
    }
    init(){
        this.professionTalent = this.getComponent(ProfessionTalent);
        this.professionTalent.init();
        this.professionTalent.loadPassiveList(Logic.talentList);
        this.organizationTalent = this.getComponent(OrganizationTalent);
        this.organizationTalent.init();
        this.organizationTalent.loadPassiveList(Logic.talentList);
    }
    clear(): void {
    }

}
