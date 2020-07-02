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
export default class BrightnessBar extends cc.Component {
    @property(cc.Slider)
    slider:cc.Slider = null;
    private selectorCallback:Function;
    onLoad() {
    }
    setSelectorCallback(callback:Function){
        this.selectorCallback = callback;
        this.updateAttribute();
    }
    updateAttribute(){
        if(this.selectorCallback){
            let num = Math.floor(this.slider.progress*10);
            this.selectorCallback(num);
        }
    }
    
}
