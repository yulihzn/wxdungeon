export default class MapLightData{
    name:string;//名字 K代表开 G代表关
    type:string;//颜色ffffffff
    x:number;//左上角
    y:number;//左上角
    width:number;//宽
    height:number;//高
    ellipse:boolean;//是否圆
    polygon:cc.Vec2[];
    valueCopy(data: MapLightData) {
        this.name = data.name;
        this.type = data.type;
        this.x = data.x;
        this.y = data.y;
        this.width = data.width;
        this.height = data.height;
        this.ellipse = data.ellipse;
        this.polygon = data.polygon;
    }
}