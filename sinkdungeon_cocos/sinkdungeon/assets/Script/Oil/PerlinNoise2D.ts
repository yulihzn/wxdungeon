// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class PerlinNoise2D {
    persistence: number = .2; // 幅度/频率 （抖动程度，越高越抖，最高1）
    octaves: number = 3; //倍频（精细度，越高越精细）

    public constructor(persistence: number, octaves: number) {
        this.persistence = persistence;
        this.octaves = octaves;
    }

    private noise(x: number, y: number): number { //噪声函数
        let n: number = x + y * 1367;
        n = (n << 13) ^ n;
        return (1 - ((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824);
    }

    private smoothedNoise(x: number, y: number): number { //光滑函数
        let corners: number = (this.noise(x - 1, y - 1) + this.noise(x + 1, y - 1) + this.noise(x - 1, y + 1) + this.noise(x + 1, y + 1)) / 16,
            sides = (this.noise(x - 1, y) + this.noise(x + 1, y) + this.noise(x, y - 1) + this.noise(x, y + 1)) / 8,
            center = this.noise(x, y) / 4;
        return corners + sides + center;
    }

    private interpolate(a: number, b: number, x: number): number { //余弦插值函数
        let f: number = (1 - Math.cos(x * 3.1415927)) * .5;
        return a * (1 - f) + b * f;
    }

    private interpolatedNoise(x: number, y: number): number {
        let ix: number = Math.floor(x), iy = Math.floor(y);
        let v1: number = this.smoothedNoise(ix, iy),
            v2: number = this.smoothedNoise(ix + 1, iy),
            v3: number = this.smoothedNoise(ix, iy + 1),
            v4: number = this.smoothedNoise(ix + 1, iy + 1),
            fx = x - ix,
            fy = y - iy,
            i1 = this.interpolate(v1, v2, fx),
            i2 = this.interpolate(v3, v4, fx);
        return this.interpolate(i1, i2, fy);
    }

    public perlinNoise(x: number, y: number): number {
        let f = 0, frequency, amplitude;
        for (let i = 0; i < this.octaves; i++) {
            frequency = Math.pow(2, i);
            amplitude = Math.pow(this.persistence, i);
            f += this.interpolatedNoise(x * frequency, y * frequency) * amplitude;
        }
        return f;
    }
}
