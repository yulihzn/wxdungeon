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
export default class PaletteSelector extends cc.Component {
    static readonly TYPE_HAIR = 0;
    static readonly TYPE_EYES = 1;
    static readonly TYPE_FACE = 2;
    @property(cc.Node)
    layout:cc.Node = null;
    colors:string[] = [];
    static readonly EYESCOLORS = ['#000000','#222034','#45283c','#663931','#fbf236','#6abe30','#37946e'
    ,'#524b24','#306082','#5b6ee1','#639bff','#5fcde4','#cbdbfc','#ffc500'
    ,'#ffffff','#9badb7','#76428a','#ac3232','#d95763','#8f974a','#c20000'];
    static readonly HAIRCOLORS = ['#000000','#222034','#45283c','#663931','#fbf236','#6abe30','#37946e'
    ,'#524b24','#306082','#5b6ee1','#639bff','#5fcde4','#cbdbfc','#ffc500'
    ,'#ffffff','#9badb7','#76428a','#ac3232','#d95763','#8f974a','#c20000'];
    static readonly FACECOLORS = ['#d77bba','#d95763','#818185','#d9a066','#663931','#fbf236','#6abe30','#37946e'
    ,'#524b24','#306082','#5b6ee1','#639bff','#5fcde4','#cbdbfc','#ffc500'
    ,'#ffffff','#9badb7','#76428a','#ac3232','#8f974a','#c20000'];
    private selectorCallback:Function;
    currentIndex = 0;
    onLoad() {
        
    }
    init(colorType:number,defaultIndex?:number){
        switch(colorType){
            case PaletteSelector.TYPE_EYES:this.colors = PaletteSelector.EYESCOLORS;break;
            case PaletteSelector.TYPE_HAIR:this.colors = PaletteSelector.HAIRCOLORS;break;
            case PaletteSelector.TYPE_FACE:this.colors = PaletteSelector.FACECOLORS;break;
        }
        this.currentIndex = defaultIndex?defaultIndex:0;
        for(let i = 0;i< this.layout.childrenCount;i++){
            let palette = this.layout.children[i];
            if(i>this.colors.length-1){
                palette.color = cc.Color.BLACK;
            }else{
                palette.color = cc.Color.WHITE.fromHEX(this.colors[i]);
            }
            palette.on(cc.Node.EventType.TOUCH_START,(event: cc.Event.EventTouch)=>{
                this.updateAttribute(palette.color);
            });
        }
        this.updateAttribute(cc.Color.WHITE.fromHEX(this.colors[this.currentIndex]));
    }
    setSelectorCallback(callback:Function){
        this.selectorCallback = callback;
        
    }
    updateAttribute(color:cc.Color){
        if(this.selectorCallback){
            this.selectorCallback(color);
        }
    }
    
}
