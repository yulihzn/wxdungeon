/**
 * 地图块
 * 
 */
export default class ChunkData{
    x:number;//当前数组的x
    y:number;//当前数组的y
    worldX:number;//世界下标的x
    worldY:number;//世界下标的y
    type:number;//地图块类别
    seed:number;//块元素种子
    floor:number;//地板类型
}