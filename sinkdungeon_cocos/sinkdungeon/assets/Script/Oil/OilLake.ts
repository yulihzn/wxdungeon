import PerlinNoise2D from "./PerlinNoise2D";
import Random from "../Utils/Random";

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
export default class OilLake {
    static readonly WIDTH: number = 64;
    static readonly HEIGHT: number = 64;
    map: string[][] = new Array();
    constructor(){
        let threshold = .14, threshold2 = -.14;
        let x0 = 0, y0 = 0, dx = 20, dy = 20;
        let perlin:PerlinNoise2D = new PerlinNoise2D();
        perlin.seed(Random.rand())
        //噪声建立地形
		dx = 20+this.getRandomNum(20);
		dy = 20+this.getRandomNum(20);
		x0 = this.getRandomNum(9999);
        y0 = this.getRandomNum(9999);
        let w = OilLake.WIDTH;
        let h = OilLake.HEIGHT;
        this.map = new Array();
		for(let i = 0;i < w;i++){
            this.map[i] = new Array();
			for(let j = 0;j < h;j++){
				this.map[i][j] = '.';
				let x = dx * i / w + x0,
                        y = dy * j / h + y0;
                        let p = perlin.simplex2(x, y);
                if (p > threshold){
                	this.map[i][j] = 'Y';
                }else if (p < threshold2){
                	this.map[i][j] = '~';
                }
				let pr = Random.rand();
				if(pr>=0&&pr<0.20&&this.map[i][j]!= '~'){
					this.map[i][j]= 'o';
				}
				if(pr>=0.20&&pr<0.25&&this.map[i][j]!= '~'){
					this.map[i][j]= 'w';
				}
			}
		}
    }
    private getRandomNum(max): number {//生成一个随机数从[min,max]
		return Math.round(Random.rand() * max);
    }

    public getDisPlay(): string {
        let str ='';
        for (let j = OilLake.HEIGHT-1; j >=0; j--) {
            for (let i = 0; i < OilLake.WIDTH; i++) {
                str+=this.map[i][j];
            }
            str+='\n';
        }
        return str;
    }
}
