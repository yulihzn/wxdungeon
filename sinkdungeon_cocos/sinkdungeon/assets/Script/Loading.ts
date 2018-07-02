import Logic from "./Logic";
import MapData from "./Data/MapData";
import EquipmentData from "./Data/EquipmentData";

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
export default class Loading extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;
    private timeDelay = 0;
    private isLevelLoaded = false;
    private isEquipmentLoaded = false;
    // LIFE-CYCLE CALLBACKS:
    

    // onLoad () {}

    start () {
        this.label.string = `Level ${Logic.level}`
        this.isLevelLoaded = false;
        this.isEquipmentLoaded = false;
        this.loadMap();
        this.loadEquipment();
    }
    loadMap(){
        if(Logic.rooms&&Logic.rooms.length>0){
            this.isLevelLoaded = true;
            return;
        }
        cc.loader.loadRes('Data/Rooms/'+Logic.chapterName,(err:Error,resource)=>{
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
                this.isLevelLoaded = true;
			}
        })
        
    }
    loadEquipment(){
        if(Logic.equipments){
            this.isEquipmentLoaded = true;
            return;
        }
        cc.loader.loadRes('Data/Equipment/equipment',(err:Error,resource)=>{
            if(err){
				cc.error(err);
			}else{
                Logic.equipments = resource;
                this.isEquipmentLoaded = true;
			}
        })
    }

    update (dt) {
        this.timeDelay += dt;
        if (this.timeDelay > 0.16 && this.isLevelLoaded&&this.isEquipmentLoaded) {
            this.timeDelay = 0;
            this.isLevelLoaded = false;
            this.isEquipmentLoaded = false;
            cc.director.loadScene('game');
        }
    }
}
