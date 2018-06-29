import Logic from "./Logic";
import MapData from "./Data/MapData";

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
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;
    private timeDelay = 0;
    private isLoaded = false;
    // LIFE-CYCLE CALLBACKS:
    

    // onLoad () {}

    start () {
        this.label.string = `Level ${Logic.level}`
        this.isLoaded = false;
        this.loadMap();
    }
    loadMap(){
        if(Logic.rooms&&Logic.rooms.length>0){
            this.isLoaded = true;
            return;
        }
        cc.loader.loadRes('Rooms/'+Logic.chapterName,(err:Error,resource)=>{
            if(err){
				cc.error(err);
			}else{
                let strs:string= resource;
                let arr = strs.split('level');
                Logic.rooms = new Array();
                for(let str of arr){
                    if(str){
                        str = str.substring(str.indexOf('=')+1,str.length)
                        Logic.rooms.push(new MapData(str));
                    }
                }
                this.isLoaded = true;
			}
        })
    }

    update (dt) {
        this.timeDelay += dt;
        if (this.timeDelay > 0.5 && this.isLoaded) {
            this.timeDelay = 0;
            this.isLoaded = false;
            cc.director.loadScene('game');
        }
    }
}
