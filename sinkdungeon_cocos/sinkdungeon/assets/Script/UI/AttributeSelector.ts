// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import AttributeData from "../Data/AttributeData";


const { ccclass, property } = cc._decorator;

@ccclass
export default class AttributeSelector extends cc.Component {
    @property(cc.Node)
    arrowLeft:cc.Node = null;
    @property(cc.Node)
    arrowRight:cc.Node = null;
    @property(cc.Label)
    label:cc.Label = null;
    @property(cc.Label)
    title:cc.Label = null;
    nameList:AttributeData[] = [];
    currentIndex = 0;
    selectorCallback:Function;
    onLoad() {
        this.arrowLeft.on(cc.Node.EventType.TOUCH_START,(event: cc.Event.EventTouch)=>{
            this.currentIndex--;
            this.updateAttribute();
        });
        this.arrowRight.on(cc.Node.EventType.TOUCH_START,(event: cc.Event.EventTouch)=>{
            this.currentIndex++;
            this.updateAttribute();
        });
    }
    init(title:string,nameList:AttributeData[],defaultIndex?:number){
        this.title.string = title;
        this.nameList = nameList;
        this.currentIndex = defaultIndex?defaultIndex:0;
        this.updateAttribute();
    }
    updateAttribute(){
        if(this.currentIndex<0){
            this.currentIndex = this.nameList.length-1;
        }else if(this.currentIndex>this.nameList.length-1){
            this.currentIndex = 0;
        }
        this.label.string = this.nameList[this.currentIndex].name;
        if(this.selectorCallback){
            this.selectorCallback(this.nameList[this.currentIndex]);
        }
    }
    
}
