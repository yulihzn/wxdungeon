export default class Random4Save{
    //伪随机数
    private static seed:number = new Date().getTime();
    static setSeed(seed:number){
        Random4Save.seed = seed;
    }
    static rand():number{
        Random4Save.seed = (Random4Save.seed*9301+49297)%233280;
        return Random4Save.seed/233280.0;
    }
    static getRandomNum(min, max): number {//生成一个随机数从[min,max]
        return min + Math.round(Random4Save.rand() * (max - min));
    }
    static getHalfChance(): boolean {
        return Random4Save.rand() > 0.5;
    }
}