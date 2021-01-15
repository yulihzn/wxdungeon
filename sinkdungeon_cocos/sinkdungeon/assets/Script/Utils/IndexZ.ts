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
    /**黑暗 */
    static readonly DARKNESS = 650;
    /**边墙 */
    static readonly WALL = 700;
    /**墙角 */
    static readonly WALLCORNER = 800;
    /** 墙角（内）*/
    static readonly WALLINTERNAL = 900;
    /** 角色*/
    static readonly ACTOR = 2000;
    /**头上 */
    static readonly OVERHEAD = 6000;
    /**屋顶 */
    static readonly ROOF = 6100;
    /** 阴影*/
    static readonly SHADOW = 6150;
    /** 雾*/
    static readonly FOG = 6200;
    /**UI */
    static readonly UI = 6300;

    static getActorZIndex(pos:cc.Vec3):number{
        let index = IndexZ.ACTOR+3000-pos.y;
        return index;
    }
}