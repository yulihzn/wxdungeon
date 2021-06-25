const { ccclass, property } = cc._decorator;
export default class NextStep extends cc.Component {
    private isExcuting = false;//是否执行中，外部控制状态
    private isInCooling = false;//是否正在冷却
    private storePoint = 0;//当前存储的技能点
    private storePointMax = 0;//最大技能点
    /**
     * 带cd的步骤
     * @param callback 执行回调
     * @param duration cd时间
     * @param finishAfterCoolDown 是否重置当前执行状态
     * @param finishCallBack cd完毕回调
     * @returns void
     */
    next(callback: Function, duration: number, finishAfterCoolDown?: boolean, finishCallBack?: Function) {
        if (this.isInCooling&&this.storePoint==0) {
            return;
        }
        if (callback) {
            callback();
        }
        this.isInCooling = true;
        this.scheduleOnce(() => {
            this.isInCooling = false;
            if (finishAfterCoolDown) {
                this.isExcuting = false;
            }
            if(finishCallBack){
                finishCallBack();
            }
        }, duration)
    }
    delay(delayTime: number) {
        this.isInCooling = true;
        this.scheduleOnce(() => { this.isInCooling = false; }, delayTime);
    }
    refreshCoolDown() {
        this.isInCooling = false;
    }
    get IsInCooling() {
        return this.isInCooling&&this.storePoint==0;
    }
    get IsExcuting() {
        return this.isExcuting;
    }
    set IsExcuting(flag: boolean) {
        this.isExcuting = flag;
    }
    get StorePoint(){
        return this.storePoint;
    }
    get StorePointMax(){
        return this.storePointMax;
    }
    set StorePointMax(max:number){
        this.storePointMax = max;
    }

}