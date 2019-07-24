import AchievementData from "./Data/AchievementData";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Achievements extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    prefab: cc.Prefab = null;
    //图片资源
    spriteFrames: { [key: string]: cc.SpriteFrame } = null;
    // LIFE-CYCLE CALLBACKS:
    iconList:cc.Sprite[] = new Array();

    onLoad() {
        this.content.removeAllChildren();
        for(let i =0;i < 25;i++){
            let icon = cc.instantiate(this.prefab);
            this.content.addChild(icon)
            let sprite = icon.getChildByName('sprite');
            sprite.color = cc.color(0,0,0);
            this.iconList.push(sprite.getComponent(cc.Sprite));
        }
        this.loadSpriteFrames();
    }
    loadSpriteFrames() {
        if (this.spriteFrames) {
            return;
        }
        cc.loader.loadResDir('Texture/Monster', cc.SpriteFrame, (err: Error, assert: cc.SpriteFrame[]) => {
            this.spriteFrames = {};
            for (let frame of assert) {
                this.spriteFrames[frame.name] = frame;
            }
            this.show();
            cc.log('texture loaded');
        })
    }
    show(){
        let data:AchievementData = Achievements.getAchievementData();
        for(let i = 0;i < this.iconList.length;i++){
            let name = `monster${i<10?'00'+i:'0'+i}`;
            let fr = this.spriteFrames[name]
            if(fr){
                this.iconList[i].node.width = 96;
                this.iconList[i].node.height = 96;
                this.iconList[i].spriteFrame = this.spriteFrames[name];
                if(data&&data.monsters&&data.monsters[name]&&data.monsters[name] == 1){
                    this.iconList[i].node.color = cc.color(255,255,255);
                }else{
                    this.iconList[i].node.color = cc.color(0,0,0);
                }

            }
        }
    }
    start() {

    }
    backToHome() {
        cc.director.loadScene('start');
    }
    static getAchievementData():AchievementData{
        let s:string = cc.sys.localStorage.getItem("achievement");
        if(!s){
            s = '{}'
        }
        let data:AchievementData = JSON.parse(s);
        if(!data||!data.monsters){
            data = new AchievementData();
        }
        return data;
    }
    static saveAchievementData(data:AchievementData):void{
        cc.sys.localStorage.setItem("achievement",JSON.stringify(data));
    }
    static addMonsterKillAchievement(name:string){
        let data:AchievementData = Achievements.getAchievementData();
        data.monsters[name] = 1;
        Achievements.saveAchievementData(data);
    }
    // update (dt) {}
}
