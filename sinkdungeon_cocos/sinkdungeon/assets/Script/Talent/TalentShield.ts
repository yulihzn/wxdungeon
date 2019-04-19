import Skill from "../Utils/Skill";
import Player from "../Player";
import StatusManager from "../Manager/StatusManager";
import { EventConstant } from "../EventConstant";
import TalentData from "../Data/TalentData";
import Logic from "../Logic";
import DamageData from "../Data/DamageData";
import Actor from "../Base/Actor";
import FlyWheel from "../Item/FlyWheel";
import Dungeon from "../Dungeon";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TalentShield extends cc.Component {
    public static readonly SHIELD_01 = 2000001;//普通 1
    public static readonly SHIELD_02 = 2000002;//迅捷反击 1
    public static readonly SHIELD_03 = 2000003;//镜面偏转 1
    public static readonly SHIELD_04 = 2000004;//元素晶盾 1
    public static readonly SHIELD_05 = 2000005;//强力盾反 1
    public static readonly SHIELD_06 = 2000006;//乾坤一掷 1
    public static readonly SHIELD_07 = 2000007;//九转回旋（减速）1
    public static readonly SHIELD_08 = 2000008;//平地惊雷（眩晕）1
    public static readonly SHIELD_09 = 2000009;//四两千斤（击退）1
    public static readonly SHIELD_10 = 2000010;//见血封喉（流血）1
    public static readonly SHIELD_11 = 2000011;//阴阳遁形（距离）1
    public static readonly SHIELD_12 = 2000012;//敏捷身法（移除减速损耗）1 
    public static readonly SHIELD_13 = 2000013;//坚韧不屈（缩短cd）1
    public static readonly SHIELD_14 = 2000014;//龟甲铜墙（举盾时间变长，非乾坤一掷）1
    private shieldSkill = new Skill();
    private shieldBackSprite: cc.Sprite = null;
    private shieldFrontSprite: cc.Sprite = null;
    private player: Player;
    private talentList: TalentData[];
    private hasTalentMap: { [key: number]: boolean } = {};
    private sprites: cc.Sprite[];
    @property(FlyWheel)
    flyWheel:FlyWheel = null;
    get IsExcuting() {
        return this.shieldSkill.IsExcuting;
    }
    set IsExcuting(flag: boolean) {
        this.shieldSkill.IsExcuting = flag;
    }
    onLoad() {
        
    }
    init(){
        this.shieldBackSprite = this.getSpriteChildSprite(['sprite', 'shieldback']);
        this.shieldFrontSprite = this.getSpriteChildSprite(['shieldfront']);
        this.shieldBackSprite.node.opacity = 0;
        this.shieldFrontSprite.node.opacity = 0;
        this.player = this.getComponent(Player);
        this.talentList = new Array();
        this.sprites = new Array();
        let arr = [2, 3, 4, 5, 9, 12, 13, 14];
        for (let i = 0; i < arr.length; i++) {
            let sprite = this.getSpriteChildSprite(['shieldfront',`sprite${arr[i]}`]);
            sprite.node.opacity = 0;
            this.sprites.push(sprite);
        }
        this.flyWheel.dungeon = this.player.node.parent.getComponent(Dungeon);
        this.flyWheel.node.active = false;
        this.node.parent = this.flyWheel.dungeon.node;
        this.node.setPosition(this.player.node.position.add(cc.v2(8,48)));
        this.flyWheel.init();
    }
    loadList(talentList: TalentData[]) {
        this.talentList = new Array();
        this.hasTalentMap = {};
        for (let t of talentList) {
            let temp = new TalentData();
            temp.valueCopy(t);
            this.talentList.push(temp);
            this.hasTalentMap[temp.id] = true;
        }
        this.changeShieldPerformance();
    }
    addTalent(id: number) {
        let data = new TalentData();
        data.id = id;
        let hasit = false;
        for (let t of this.talentList) {
            if(id == t.id){
                hasit = true;
            }
        }
        if(!hasit){
            this.talentList.push(data);
            this.hasTalentMap[data.id] = true;
            this.changeShieldPerformance();
        }
    }
    changeShieldPerformance() {
        //隐藏所有额外显示
        for (let sprite of this.sprites) {
            sprite.node.opacity = 0;
        }
        this.shieldFrontSprite.node.color = cc.color(255, 255, 255);
        let isThrow = false;
        //[2,3,4,5,9,12,13,14];
        for (let t of this.talentList) {
            if (t.id == TalentShield.SHIELD_01) {
            } else if (t.id == TalentShield.SHIELD_02) {
                this.sprites[0].node.opacity = 255;
            } else if (t.id == TalentShield.SHIELD_03) {
                this.sprites[1].node.opacity = 255;
            } else if (t.id == TalentShield.SHIELD_04) {
                this.sprites[2].node.opacity = 255;
            } else if (t.id == TalentShield.SHIELD_05) {
                this.sprites[3].node.opacity = 255;
            } else if (t.id == TalentShield.SHIELD_06) {
                isThrow = true;
            } else if (t.id == TalentShield.SHIELD_07) {
                this.shieldFrontSprite.node.color = cc.color(0, 0, 0);
            } else if (t.id == TalentShield.SHIELD_08) {
                this.shieldFrontSprite.node.color = cc.color(0, 0, 0);
            } else if (t.id == TalentShield.SHIELD_09) {
                this.sprites[4].node.opacity = 255;
            } else if (t.id == TalentShield.SHIELD_10) {
                this.shieldFrontSprite.node.color = cc.color(0, 0, 0);
            } else if (t.id == TalentShield.SHIELD_11) {
                this.shieldFrontSprite.node.color = cc.color(0, 0, 0);
            } else if (t.id == TalentShield.SHIELD_12) {
                this.sprites[5].node.opacity = 255;
            } else if (t.id == TalentShield.SHIELD_13) {
                this.sprites[6].node.opacity = 255;
            } else if (t.id == TalentShield.SHIELD_14) {
                this.sprites[7].node.opacity = 255;
            }
        }
        this.changeRes(isThrow ? 'shield06' : 'shield01');
        this.flyWheel.changeShieldPerformance(this.talentList);
    }
    changeRes(resName: string) {
        if (!resName || resName.length < 1) {
            return;
        }
        this.shieldBackSprite.spriteFrame = Logic.spriteFrames[resName];
        this.shieldFrontSprite.spriteFrame = Logic.spriteFrames[resName];
    }
    public useShield(): void {
        if (!this.shieldSkill) {
            return;
        }
        if (this.shieldSkill.IsExcuting) {
            return;
        }
        let cooldown = 6;
        let invulnerabilityTime = 1;
       
        if(this.hashTalent(TalentShield.SHIELD_13)){
            cooldown = 3;
        }
        this.shieldSkill.next(() => {
            let statusName = StatusManager.SHIELD_NORMAL;
            let isNormalSpeed = this.hashTalent(TalentShield.SHIELD_12);
            let animOverTime = 0.1;
            this.shieldSkill.IsExcuting = true;
            let y = this.shieldFrontSprite.node.y;
            this.shieldBackSprite.node.scaleX = 1;
            this.shieldFrontSprite.node.scaleX = 0;
            this.shieldBackSprite.node.opacity = 255;
            this.shieldFrontSprite.node.opacity = 255;
            this.shieldFrontSprite.node.x = -8;

            if(isNormalSpeed){
                statusName = StatusManager.SHIELD_NORMAL_SPEED;
            }
            if(this.hashTalent(TalentShield.SHIELD_14)){
                statusName = StatusManager.SHIELD_LONG;
                invulnerabilityTime = 2;
                if(isNormalSpeed){
                    statusName = StatusManager.SHIELD_LONG_SPEED;
                }
            }
            if(this.hashTalent(TalentShield.SHIELD_06)){
                invulnerabilityTime = 0;
                animOverTime = 0;
            }
            let backAction = cc.sequence(cc.scaleTo(0.1, 0, 1), cc.moveTo(0.1, cc.v2(-16, y))
                , cc.delayTime(invulnerabilityTime), cc.moveTo(animOverTime, cc.v2(-8, y)), cc.scaleTo(animOverTime, 1, 1));
            let frontAction = cc.sequence(cc.scaleTo(0.1, 1, 1), cc.moveTo(0.1, cc.v2(8, y))
                , cc.delayTime(invulnerabilityTime), cc.moveTo(animOverTime, cc.v2(-8, y)), cc.scaleTo(animOverTime, 0, 1));
            this.shieldBackSprite.node.runAction(backAction);
            this.shieldFrontSprite.node.runAction(frontAction);
            this.scheduleOnce(() => {
                if (this.hashTalent(TalentShield.SHIELD_06)) {
                    //乾坤一掷
                    this.shieldBackSprite.node.opacity = 0;
                    this.throwShield();
                } else {
                    //添加状态
                    this.player.addStatus(statusName);
                }
            }, 0.2);
            this.scheduleOnce(()=>{
                this.shieldSkill.IsExcuting = false;
            },invulnerabilityTime+0.2)
            this.scheduleOnce(()=>{
                this.shieldBackSprite.node.opacity = 255;
            },1)
            cc.director.emit(EventConstant.HUD_CONTROLLER_COOLDOWN, { detail: { cooldown: cooldown } });
        }, cooldown, true);
    }
    private throwShield() {
        if(this.flyWheel){
            this.flyWheel.show();
        }
    }
    private getSpriteChildSprite(childNames: string[]): cc.Sprite {
        let node = this.node;
        for (let name of childNames) {
            node = node.getChildByName(name);
        }
        return node.getComponent(cc.Sprite);
    }
    hashTalent(id: number): boolean {
        return this.hasTalentMap[id]&&this.hasTalentMap[id]==true;
    }
    canAddStatus(statusType: string):boolean{
        if(!this.hashTalent(TalentShield.SHIELD_04)){
            return true;
        }
        let cant = statusType == StatusManager.FROZEN
        ||statusType == StatusManager.BURNING
        ||statusType == StatusManager.DIZZ
        ||statusType == StatusManager.TOXICOSIS
        ||statusType == StatusManager.CURSING
        ||statusType == StatusManager.BLEEDING
        return !cant;
    }
    takeDamage(damageData: DamageData, actor?: Actor){
        //反弹伤害
        if (actor && this.IsExcuting) {
            if (this.hashTalent(TalentShield.SHIELD_05)) {
                actor.takeDamage(new DamageData(5));
            } else if (this.hashTalent(TalentShield.SHIELD_02)) {
                actor.takeDamage(new DamageData(1));
            }
        }
    }
}