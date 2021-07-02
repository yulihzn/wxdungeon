const { ccclass, property } = cc._decorator;
export default class NextStep extends cc.Component {
    private isExcuting = false;//是否执行中，外部控制状态,用于判断当前技能是否正在执行
    private storePoint = 1;//当前存储的技能点
    private storePointMax = 1;//最大技能点默认为1
    private duration = 0;
    private isLooping = false;//是否正在冷却
    private secondCallback: Function;
    private excuteRest = false;
    private secondCount = 0;

    /**
     * 
     * @param needCooling 初始是否需要冷却
     * @param storePointMax 最大存储点
     * @param storePoint 初始存储点
     */
    init(needCooling?: boolean, storePointMax?: number, storePoint?: number,duration?:number, lastSecond?: number,secondCallback?: Function) {
        this.secondCallback = secondCallback;
        this.storePointMax = storePointMax ? storePointMax : 1;
        this.duration = duration&&duration>0?duration:0;
        if (this.storePointMax < 1) {
            this.storePointMax = 1;
        }
        this.storePoint = storePoint||storePoint==0 ? storePoint : 1;
        if (this.storePoint <= 0) {
            this.storePoint = 0;
        }
        if (this.storePoint > this.storePointMax) {
            this.storePoint = this.storePointMax;
        }
        if (needCooling) {
            this.storePoint = 0;
        }else{
            this.startLoop(lastSecond);
        }
    }
    private startLoop(lastSecond?: number) {
        if (this.isLooping) {
            return;
        }
        this.unscheduleAllCallbacks();
        this.secondCount = lastSecond&&lastSecond>0 ? lastSecond : this.duration;
        this.isLooping = true;
        if (this.storePointMax == this.storePoint) {
            this._refreshCoolDown();
            //读秒回调
            if (this.secondCallback) {
                this.secondCallback(this.secondCount);
            }
            return;
        }
        this.schedule(() => {
            this.secondCount--;
            //冷却完成，存储点+1
            if (this.secondCount <= 0) {
                if (this.excuteRest) {
                    this.isExcuting = false;
                }
                this._refreshCoolDown();

            }
            //读秒回调
            if (this.secondCallback) {
                this.secondCallback(this.secondCount);
            }

        }, this.duration<1?this.duration:1, cc.macro.REPEAT_FOREVER);
    }
    /**
     * 带cd的步骤
     * @param callback 执行回调
     * @param duration 冷却时长
     * @param excuteRest 冷却完成是否重置执行状态
     * @param secondCallback 每秒的回调
     * @returns void
     */
    next(callback: Function, duration?: number, excuteRest?: boolean, secondCallback?: Function) {
        this.secondCallback = secondCallback;
        this.excuteRest = excuteRest;
        this.duration = duration;
        //存储点为0不执行，如果未处于循环状态，开启循环
        if (this.storePoint == 0) {
            this.startLoop();
            return;
        }
        //存储点-1并执行下一步
        this.storePoint--;
        if (this.storePoint <= 0) {
            this.storePoint = 0;
        }
        //如果未处于循环状态，开启循环
        this.startLoop();
        if (callback) {
            callback();
        }
    }

    cutCoolDown(cutSecond: number): number {
        if (cutSecond  && this.isLooping) {
            this.secondCount -= cutSecond;
        }
        return this.secondCount <=0 ? 0 : this.secondCount;
    }
    refreshCoolDown() {
        this._refreshCoolDown();
    }
    /**
     * 冷却刷新
     */
    private _refreshCoolDown() {
        this.storePoint++;
        this.secondCount = 0;
        //达到最大存储点取消循环
        if (this.storePoint >= this.storePointMax) {
            this.storePoint = this.storePointMax;
            this.isLooping = false;
            this.secondCount = 0;
            this.unscheduleAllCallbacks();
        }else{
            this.secondCount = this.duration;
        }

    }
    /**
     * 是否处于冷却中
     */
    get IsInCooling() {
        return this.storePoint < this.StorePointMax;
    }
    get IsExcuting() {
        return this.isExcuting;
    }
    set IsExcuting(flag: boolean) {
        this.isExcuting = flag;
    }
    get StorePoint() {
        return this.storePoint;
    }
    get StorePointMax() {
        return this.storePointMax;
    }
}