import { EventHelper } from "../EventHelper";
import Talent from "./Talent";
import DamageData from "../data/DamageData";
import StatusManager from "../manager/StatusManager";
import FromData from "../data/FromData";
import Shooter from "../Shooter";
import MagicCircle from "./MagicCircle";
import MagicIce from "./MagicIce";
import Actor from "../base/Actor";
import FireGhost from "./FireGhost";
import Logic from "../Logic";
import IceThron from "./IceThron";
import AudioPlayer from "../utils/AudioPlayer";
import TalentData from "../data/TalentData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TalentMagic extends Talent {

    @property(MagicCircle)
    magiccircle: MagicCircle = null;
    @property(MagicIce)
    magicice: MagicIce = null;
    @property(cc.Prefab)
    icethron: cc.Prefab = null;
    @property(cc.Prefab)
    fireGhost: cc.Prefab = null;
    @property(cc.Node)
    magicLighteningCircle: cc.Node = null;
    fireGhostNum = 0;
    ghostPool: cc.NodePool;
    onLoad() {
        this.ghostPool = new cc.NodePool(FireGhost);
        cc.director.on('destoryfireghost', (event) => {
            this.destroyGhost(event.detail.coinNode);
        })
    }
    destroyGhost(ghostNode: cc.Node) {
        if (!ghostNode) {
            return;
        }
        ghostNode.active = false;
        if (this.ghostPool) {
            this.ghostPool.put(ghostNode);
            this.fireGhostNum--;
            cc.log('destroyGhost');
        }
    }
    init(data:TalentData) {
        this.magicLighteningCircle.opacity = 0;
        super.init(data);
        this.scheduleOnce(() => {
            if (this.hashTalent(Talent.MAGIC_07)) {
                this.player.addStatus(this.hashTalent(TalentMagic.MAGIC_06) ? StatusManager.MAGIC_WEAPON_STRONG : StatusManager.MAGIC_WEAPON, new FromData());
            }
            if (this.hashTalent(Talent.MAGIC_13) && !this.magicice.isShow) {
                this.magicice.showIce();
            }
            if (this.hashTalent(Talent.MAGIC_10)) {
                this.initFireGhosts();
            }
            if (this.hashTalent(TalentMagic.MAGIC_16)) {
                this.showLighteningCircle();
            }
        }, 0.2)
    }
    protected skillCanUse(){
        return true;
    }
    useSKill() {
        this.doSkill();
    }
    protected doSkill() {
        if (!this.talentSkill) {
            return;
        }
        if (this.talentSkill.IsExcuting) {
            return;
        }
        let cooldown = 7;
        if (this.hashTalent(Talent.MAGIC_04)) {
            cooldown = 3;
        }

        this.talentSkill.next(() => {
            this.talentSkill.IsExcuting = true;
            this.magiccircle.talentMaigc = this;
            this.magiccircle.playMagic(this.hashTalent(Talent.MAGIC_03));
            // cc.director.emit(EventConstant.PLAY_AUDIO, { detail: { name: AudioPlayer.DASH } });
            // cc.director.emit(EventHelper.HUD_CONTROLLER_COOLDOWN, { detail: { cooldown: cooldown, talentType: 3,currentCooldown:0 } });
        }, cooldown, true);
    }
    //anim
    MagicFinish() {
        if (this.hashTalent(Talent.MAGIC_09)) {
        } else if (this.hashTalent(Talent.MAGIC_08)) {
        } else if (this.hashTalent(Talent.MAGIC_12)) {
            this.showIceThron();
        } else if (this.hashTalent(Talent.MAGIC_11)) {
            this.showIceThron();
        } else if (this.hashTalent(Talent.MAGIC_15)) {
            this.schedule(()=>{
                this.addLighteningFall(this.hashTalent(Talent.MAGIC_06),8);
            },0.2,this.hashTalent(Talent.MAGIC_02)?1:0);
        } else if (this.hashTalent(Talent.MAGIC_14)) {
            this.schedule(()=>{
                this.addLighteningFall(this.hashTalent(Talent.MAGIC_06),5);
            },0.2,this.hashTalent(Talent.MAGIC_02)?1:0);
        } else if (this.hashTalent(Talent.MAGIC_01)) {
            AudioPlayer.play(AudioPlayer.SKILL_MAGICBALL);
            this.fire(this.player.shooterEx,80, this.hashTalent(Talent.MAGIC_06) ? 'bullet135' : 'bullet035');
        }
    }
   
    
    showIceThron() {
        this.scheduleOnce(()=>{AudioPlayer.play(AudioPlayer.SKILL_ICETHRON);},1);
        const angles1 = [0,45,90,135,180,225,270,315];
        const angles2 = [15,60,105,150,195,240,285,330];
        let distance1 = [100];
        let distance2 = [100,150];
        let distance3 = [100,150,200];
        let scale1 = [3];
        let scale2 = [3,4];
        let scale3 = [3,4,5];
        let scale4 = [3,5];
        let a1 = [angles1];
        let a2 = [angles1,angles2];
        let a3 = [angles1,angles2,angles1];
        let a = a1;
        let scale = scale1;
        let distance = distance1;
        if (this.hashTalent(Talent.MAGIC_02)) {
            a = a2;
            scale = scale2;
            distance = distance2;
        }
        if (this.hashTalent(Talent.MAGIC_12)) {
            a = a2;
            scale = scale4;
            distance = distance2;
            if (this.hashTalent(Talent.MAGIC_02)) {
                a = a3;
                scale = scale3;
                distance = distance3;
            }
        }
        let index = 0;
        this.schedule(()=>{
            for(let i = 0;i<a[index].length;i++){
                cc.instantiate(this.icethron).getComponent(IceThron).show(this.player, a[index][i],distance[index],scale[index]);
            }
            index++;
        },0.5,a.length-1);
    }
    fire(shooter: Shooter,bulletArcExNum:number, bulletType: string) {
        shooter.data.bulletType = bulletType;
        shooter.data.bulletArcExNum = bulletArcExNum;
        if (this.hashTalent(Talent.MAGIC_02)) {
            shooter.data.bulletArcExNum = bulletArcExNum==80?99:2;
        }
        shooter.data.bulletLineExNum = 0;
        shooter.fireBullet(0);
    }

    changePerformance() {

    }
    takeIce(): boolean {
        if (this.hashTalent(Talent.MAGIC_13) && this.magicice.isShow) {
            this.addStatus2NearEnemy(this.player.node,StatusManager.FROZEN, 300);
            this.magicice.breakIce();
            return true;
        }
        return false;
    }
    takeDamage(damageData: DamageData, actor?: Actor) {
        return false;
    }
    addLighteningFall(isArea:boolean,damagePoint:number){
        EventHelper.emit(EventHelper.DUNGEON_ADD_LIGHTENINGFALL,{pos:this.getNearestEnemyPosition(),showArea:isArea,damage:damagePoint})
    }
    getNearestEnemyPosition():cc.Vec3{
        let shortdis = 99999;
        let targetNode:cc.Node;
        for (let monster of this.player.weaponRight.meleeWeapon.dungeon.monsterManager.monsterList) {
            if (!monster.sc.isDied) {
                let dis = Logic.getDistanceNoSqrt(this.node.position, monster.node.position);
                if(dis<shortdis){
                    shortdis = dis;
                    targetNode = monster.node;
                }
            }
        }
        for (let boss of this.player.weaponRight.meleeWeapon.dungeon.monsterManager.bossList) {
            if (!boss.sc.isDied) {
                let dis = Logic.getDistanceNoSqrt(this.node.position, boss.node.position);
                if(dis<shortdis){
                    shortdis = dis;
                    targetNode = boss.node;
                }
            }
        }
        if(targetNode){
            return targetNode.position;
        }
        return this.node.position.addSelf(cc.v3(Logic.getRandomNum(0, 600) - 300,Logic.getRandomNum(0, 600) - 300));
    }
    showLighteningCircle() {
        this.magicLighteningCircle.opacity = 128;
        this.magicLighteningCircle.scale = 1;
        cc.tween(this.magicLighteningCircle).to(1,{scale:10}).call(()=>{
            this.addStatus2NearEnemy(this.player.node,StatusManager.DIZZ, 300);
            this.magicLighteningCircle.opacity = 0;
            this.magicLighteningCircle.scale = 1;
        }).start();
    }
    initFireGhosts() {
        let length = 5;
        let count = this.fireGhostNum;
        for (let i = 0; i < length-count; i++) {
            let ghostNode: cc.Node = null;
            if (this.ghostPool.size() > 0) {
                ghostNode = this.ghostPool.get();
            }
            if (!ghostNode || ghostNode.active) {
                ghostNode = cc.instantiate(this.fireGhost);
            }
            this.fireGhostNum++;
            ghostNode.active = true;
            let fg = ghostNode.getComponent(FireGhost);
            this.player.node.parent.addChild(fg.node);
            fg.init(this.player, i * 72);
        }
    }

    checkTimeDelay = 0;
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > 10) {
            this.checkTimeDelay = 0;
            return true;
        }
        return false;
    }
}