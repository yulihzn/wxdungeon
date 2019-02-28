export default class Random{
    //伪随机数
    private static seed:number = new Date().getTime();
    setSeed(seed:number){
        Random.seed = seed;
    }
    static rand():number{
        Random.seed = (Random.seed*9301+49297)%233280;
        return Random.seed/233280.0;
    }
    static getRandomNum(min, max): number {//生成一个随机数从[min,max]
        return min + Math.round(Random.rand() * (max - min));
    }
    static getHalfChance(): boolean {
        return Random.rand() > 0.5;
    }
}