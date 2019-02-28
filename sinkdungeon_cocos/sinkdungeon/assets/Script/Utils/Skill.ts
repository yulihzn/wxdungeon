const {ccclass, property} = cc._decorator;
export default class Skill extends cc.Component{
    private isExcuting = false;
    private isInCooling = false;
    private 
    next(callback:Function,delay:number,finishAfterCoolDown?:boolean){
        if(this.isInCooling){
            return;
        }
        if(callback){
            callback();
        }
        this.isInCooling = true;
        this.scheduleOnce(()=>{this.isInCooling = false;if(finishAfterCoolDown){this.isExcuting = false;}},delay)
    }
    refreshCoolDown(){
        this.isInCooling = false;
    }
    get IsExcuting(){
        return this.isExcuting;
    }
    set IsExcuting(flag:boolean){
        this.isExcuting = flag;
    }
}