const {ccclass, property} = cc._decorator;
export default class NextStep extends cc.Component{
    private isExcuting = false;
    private _isInCooling = false;
    next(callback:Function,delay:number,finishAfterCoolDown?:boolean){
        if(this._isInCooling){
            return;
        }
        if(callback){
            callback();
        }
        this._isInCooling = true;
        this.scheduleOnce(()=>{this._isInCooling = false;if(finishAfterCoolDown){this.isExcuting = false;}},delay)
    }
    delay(delayTime:number){
        this._isInCooling = true;
        this.scheduleOnce(()=>{this._isInCooling = false;},delayTime);
    }
    refreshCoolDown(){
        this._isInCooling = false;
    }
    get isInCooling(){
        return this._isInCooling;
    }
    get IsExcuting(){
        return this.isExcuting;
    }
    set IsExcuting(flag:boolean){
        this.isExcuting = flag;
    }

}