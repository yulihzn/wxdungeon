export default class Random4Save{
    //伪随机数
    private seed:number = new Date().getTime();
    constructor(seed:number){
        this.seed = seed;
        if(seed<=0){
            seed = this.getRandomNum(0,100000000);
        }
    }
    get Seed(){
        return this.seed;
    }
    rand():number{
        this.seed = (this.seed*9301+49297)%233280;
        return this.seed/233280.0;
    }
    getRandomNum(min, max): number {//生成一个随机数从[min,max]
        return min + Math.round(this.rand() * (max - min));
    }
    getHalfChance(): boolean {
        return this.rand() > 0.5;
    }
}