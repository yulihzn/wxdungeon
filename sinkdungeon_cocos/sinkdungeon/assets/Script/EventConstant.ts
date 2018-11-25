
const {ccclass, property} = cc._decorator;
@ccclass
export class EventConstant extends cc.Component{
    public static readonly PLAYER_MOVE = 'PLAYER_MOVE';
    public static readonly PLAYER_ROTATE = 'PLAYER_ROTATE';
    public static readonly PLAYER_USEITEM = 'PLAYER_USEITEM';
    public static readonly PLAYER_ATTACK = 'PLAYER_ATTACK';
    public static readonly PLAYER_REMOTEATTACK = 'PLAYER_REMOTEATTACK';
    public static readonly PLAYER_GETITEM = 'PLAYER_GETITEM';
    public static readonly PLAYER_TAKEDAMAGE= 'PLAYER_TAKEDAMAGE';
    public static readonly INVENTORY_CHANGEITEM = 'INVENTORY_CHANGEITEM';
    public static readonly PLAYER_CHANGEWEAPON= 'PLAYER_CHANGEWEAPON';
    public static readonly PLAYER_CHANGEEQUIPMENT= 'PLAYER_CHANGEEQUIPMENT';
    public static readonly LOADINGNEXTLEVEL= 'LOADINGNEXTLEVEL';
    public static readonly CHANGE_MINIMAP= 'CHANGE_MINIMAP';
    public static readonly LOADINGROOM= 'LOADINGROOM';
    public static readonly DUNGEON_SETEQUIPMENT = 'DUNGEON_SETEQUIPMENT';
    public static readonly DUNGEON_SHAKEONCE = 'DUNGEON_SHAKEONCE';
    public static readonly HUD_ADD_COIN = 'HUD_ADD_COIN';
    public static readonly DUNGEON_ADD_COIN = 'DUNGEON_ADD_COIN';
    public static readonly DUNGEON_ADD_HEART = 'DUNGEON_ADD_HEART';
    public static readonly DUNGEON_ADD_AMMO = 'DUNGEON_ADD_AMMO';
    public static readonly DUNGEON_ADD_FALLSTONE = 'DUNGEON_ADD_FALLSTONE';
    public static readonly PLAYER_STATUSUPDATE = 'PLAYER_STATUSUPDATE';
    public static readonly MONSTER_STATUSUPDATE = 'MONSTER_STATUSUPDATE';
    public static eventHandler:cc.Node = new cc.Node();
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // start () {

    // }

    // update (dt) {}
}
