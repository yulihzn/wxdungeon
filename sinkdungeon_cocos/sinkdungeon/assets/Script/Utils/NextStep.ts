const { ccclass, property } = cc._decorator;
export default class NextStep extends cc.Component {
    private isExcuting = false;//是否执行中，外部控制状态,用于判断当前技能是否正在执行
    private storePoint = 1;//当前存储的技能点
    private storePointMax = 1;//最大技能点默认为1
    private duration = 0;
    private isLooping = false;//是否正在冷却
    private secondCallback: Function;
    private excuteRest = false;
    private lastTime = 0;//最近使用时间
    private intervalTime = 0.1;//循环间隔时间

    /**
     * 
     * @param needCooling 初始是否需要重新冷却 针对那种一开始就为空的，保证第一次无法发动
     * @param storePointMax 最大存储点
     * @param storePoint 初始存储点
     * @param duration 冷却时长
     * @param lastTime 最近触发时间
     * @param secondCallback 读秒回调
     */
    init(needCooling?: boolean, storePointMax?: number, storePoint?: number, duration?: number, lastTime?: number, secondCallback?: Function, intervalTime?: number) {
        this.secondCallback = secondCallback;
        this.storePointMax = storePointMax ? storePointMax : 1;
        this.duration = duration && duration > 0 ? duration : 0;
        this.intervalTime = intervalTime && intervalTime > 0 ? intervalTime : this.intervalTime;
        //默认存储点为1
        if (this.storePointMax < 1) {
            this.storePointMax = 1;
        }
        this.storePoint = storePoint || storePoint == 0 ? storePoint : 1;
        if (this.storePoint <= 0) {
            this.storePoint = 0;
        }
        if (this.storePoint > this.storePointMax) {
            this.storePoint = this.storePointMax;
        }
        //如果需要重新冷却则存储点置为0，否则未开始循环下就开始循环
        if (needCooling) {
            this.storePoint = 0;
        } else {
            this.startLoop(lastTime);
        }
    }

    private startLoop(lastTime?: number) {
        if (this.isLooping) {
            return;
        }
        this.unscheduleAllCallbacks();
        this.isLooping = true;
        this.lastTime = lastTime || lastTime == 0 ? lastTime : Date.now();
        //如果当前的存储点已满则不进入倒计时
        if (this.storePointMax == this.storePoint) {
            this._refreshCoolDown();
            //读秒回调
            if (this.secondCallback) {
                this.secondCallback(this.lastTime);
            }
            return;
        }
        //无限循环直到冷却点数达到最大值结束
        let intervalTime = this.duration < this.intervalTime ? this.duration : this.intervalTime;
        this.schedule(() => {
            //冷却完成，存储点+1
            let currentTime = Date.now();
            if (currentTime - this.lastTime > this.duration * 1000) {
                if (this.excuteRest) {
                    this.isExcuting = false;
                }
                this._refreshCoolDown();
            }
            //读秒回调
            if (this.secondCallback) {
                this.secondCallback(this.lastTime);
            }
        }, intervalTime, cc.macro.REPEAT_FOREVER, intervalTime);
    }
    /**
     * 带cd的步骤
     * @param callback 执行回调
     * @param duration 冷却时长
     * @param excuteReset 冷却完成是否重置执行状态
     * @param secondCallback 每秒的回调
     * @returns void
     */
    next(callback: Function, duration?: number, excuteReset?: boolean, secondCallback?: Function, intervalTime?: number) {
        this.secondCallback = secondCallback;
        this.excuteRest = excuteReset;
        this.duration = duration;
        this.intervalTime = intervalTime && intervalTime > 0 ? intervalTime : this.intervalTime;
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
        //执行步骤
        if (callback) {
            callback();
        }
    }

    /**
     * 缩短冷却
     * @param cutSecond 秒 
     * @returns 
     */
    cutCoolDown(cutSecond: number): number {
        if (cutSecond && this.isLooping) {
            this.lastTime += cutSecond * 1000;
        }
        return this.lastTime;
    }
    refreshCoolDown(duration: number) {
        this._refreshCoolDown();
        return this.cutCoolDown(duration);
    }
    /**
     * 冷却刷新
     */
    private _refreshCoolDown() {
        this.storePoint++;
        //达到最大存储点取消循环 并清空上次触发时间
        if (this.storePoint >= this.storePointMax) {
            this.lastTime = 0;
            this.storePoint = this.storePointMax;
            this.isLooping = false;
            this.unscheduleAllCallbacks();
        } else {
            //未达到最大存储上次触发时间改为当前时间
            this.lastTime = Date.now();
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
    get LastTime() {
        return this.lastTime;
    }
    get StorePointMax() {
        return this.storePointMax;
    }
}