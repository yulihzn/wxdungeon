const {ccclass, property} = cc._decorator;
export default class Skill extends cc.Component{
    private isExcuting = false;
    next(callback:Function,delay:number){
        if(this.isExcuting){
            return;
        }
        if(callback){
            callback();
        }
        this.isExcuting = true;
        this.scheduleOnce(()=>{this.isExcuting = false;},delay)
    }
    get IsExcuting(){
        return this.isExcuting;
    }
    set IsExcuting(flag:boolean){
        this.isExcuting = flag;
    }
}