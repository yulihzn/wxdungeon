/*关卡管理
一共五章和一个开始房间
开始房间：
一个出生点，一个初级宝箱房，一个打牌室和一个占卜屋。占卜屋完成进入第一章。
第一章 
1x12x2 3x3 4x4 5x5
第二章 1x1 2x2 3x3 4x4 5x5
第三章 1x1 2x2 3x3 4x4 5x5
第四章 1x1 2x2 3x3 4x4 5x5
第五章 1x1 2x2 3x3 4x4 5x5
*/
export default class LevelManager {
    public static readonly CHAPTER00 = "chapter00"
    public static readonly CHAPTER01 = "chapter01"
    public static readonly CHAPTER02 = "chapter02"
    public static readonly CHAPTER03 = "chapter03"
    public static readonly CHAPTER04 = "chapter04"

    level = 0;
    chapter = LevelManager.CHAPTER00;
    constructor(){

    }
    init():void{

    }
}