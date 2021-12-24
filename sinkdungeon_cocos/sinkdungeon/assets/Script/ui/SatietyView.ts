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
export default class SatietyView extends cc.Component {
    @property(cc.Node)
    solid: cc.Node = null;
    @property(cc.Node)
    solid1: cc.Node = null;
    @property(cc.Node)
    liquid: cc.Node = null;
    @property(cc.Node)
    liquid1: cc.Node = null;
    @property(cc.Node)
    tips:cc.Node = null;
    @property(cc.Label)
    solidlabel:cc.Label = null;
    @property(cc.Label)
    liquidlabel:cc.Label = null;
    @property(cc.Label)
    solidlabel1:cc.Label = null;
    @property(cc.Label)
    liquidlabel1:cc.Label = null;
    static readonly SOLIDTIPS= [`饥肠辘辘`,`略微小食`,`菜过五味`,`酒足饭饱`,`快撑爆了`];
    static readonly LIQUIDTIPS= [`喉咙冒烟`,`口干舌燥`,`酒过三巡`,`非常满足`,`快撑爆了`];
    static readonly PEETIPS= [`风平浪静`,`泛起微波`,`涓涓细流`,`波涛汹涌`,`狂涛怒吼`];
    static readonly POOTIPS= [`身轻如燕`,`如释重负`,`人有三急`,`不堪重负`,`寸步难行`];
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.tips.active = false;
        this.node.on(cc.Node.EventType.TOUCH_START,()=>{
            this.tips.active = true;
        })
        this.node.on(cc.Node.EventType.TOUCH_END,()=>{
            this.tips.active = false;
        })
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,()=>{
            this.tips.active = false;
        })
    }

    start () {
        
    }
    refreshPercent(solid:number,solid1:number,liquid:number,liquid1:number): void {
        if(!this.node){
            return;
        }
        this.node.stopAllActions();
        cc.tween(this.solid).to(0.5,{height:solid}).start();
        cc.tween(this.solid1).to(0.5,{height:solid1}).start();
        cc.tween(this.liquid).to(0.5,{height:liquid}).start();
        cc.tween(this.liquid1).to(0.5,{height:liquid1}).start();
        this.solidlabel.string = this.getStr(solid,SatietyView.SOLIDTIPS);
        this.solidlabel1.string = this.getStr(solid,SatietyView.POOTIPS);
        this.liquidlabel.string = this.getStr(solid,SatietyView.LIQUIDTIPS);
        this.liquidlabel1.string = this.getStr(solid,SatietyView.PEETIPS);
        this.solidlabel.node.color = this.getColor(solid,false);
        this.solidlabel.node.color = this.getColor(solid,true);
        this.liquidlabel.node.color = this.getColor(liquid,false);
        this.liquidlabel1.node.color = this.getColor(liquid1,true);
	}
    private getStr(percent:number,arr:string[]){
        let str = ``;
        if(percent<20){
            str = arr[0];
        }else if(percent<40){
            str =  arr[1];
        }else if(percent<60){
            str =  arr[2];
        }else if(percent<80){
            str =  arr[3];
        }else{
            str =  arr[4];
        }
        return `${str}(${percent.toFixed()}/100)`;
    }
    private getColor(percent:number,reverse:boolean){
        let colors = ['#DC143C', '#FFC0CB', '#FFFF00', '#ADFF2F','#90EE90'];
        if(reverse){
            colors = ['#90EE90', '#ADFF2F', '#FFFF00', '#FFC0CB','#DC143C'];
        }
        if(percent<20){
            return cc.color().fromHEX(colors[0]);
        }else if(percent<40){
            return cc.color().fromHEX(colors[0]);
        }else if(percent<60){
            return cc.color().fromHEX(colors[0]);
        }else if(percent<80){
            return cc.color().fromHEX(colors[0]);
        }else{
            return cc.color().fromHEX(colors[0]);

        }
    }
    
    
}
