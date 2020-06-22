export default class IndexZ{
    /** 背景*/
    static readonly BACKGROUND = 100;
    /** 海妖身躯*/
    static readonly KRAKENBODY = 200;
    /** 背景地板*/
    static readonly BACKGROUNDFLOOR = 300;
    /** 门后的墙*/
    static readonly DOORWALLBEHIND = 400;
    /**底层 */
    static readonly BASE = 500;
    /**地板 */
    static readonly FLOOR = 600;
    /**边墙 */
    static readonly WALL = 700;
    /** 角色*/
    static readonly ACTOR = 2000;
    
    /**边墙 */
    static readonly WALLSIDEFRONT = 5000;

    /** 门上的墙*/
    static readonly DOORWALL = 5100;
    /**头上 */
    static readonly OVERHEAD = 6000;
    /**屋顶 */
    static readonly ROOF = 6100;
    /** 雾*/
    static readonly FOG = 6200;
    /**UI */
    static readonly UI = 6300;

    static getActorZIndex(pos:cc.Vec3):number{
        let index = IndexZ.ACTOR+3000-pos.y;
        return index;
    }
}