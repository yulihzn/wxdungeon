export default class Vector{
    x=0;
    y=0;
    constructor (x: number | Vector = 0, y: number = 0) {
        if (x && typeof x === 'object') {
            this.x = x.x || 0;
            this.y = x.y || 0;
        } else {
            this.x = x as number || 0;
            this.y = y || 0;
        }
    }

    /**
     * !#en clone a Vec2 object
     * !#zh 克隆一个 Vec2 对象
     * @method clone
     * @return {Vec2}
     */
    clone (): Vector {
        return new Vector(this.x, this.y);
    }
    equals (other: Vector): boolean {
        return other && this.x === other.x && this.y === other.y;
    }

    static v2(x:number,y:number){
        return new Vector(x,y);
    }
}