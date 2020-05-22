
const {ccclass, property} = cc._decorator;
@ccclass
export class EventHelper extends cc.Component{
    public static readonly PLAYER_MOVE = 'PLAYER_MOVE';
    public static readonly PLAYER_ROTATE = 'PLAYER_ROTATE';
    public static readonly PLAYER_TRIGGER = 'PLAYER_TRIGGER';
    public static readonly PLAYER_USEITEM = 'PLAYER_USEITEM';
    public static readonly USEITEM_KEYBOARD = 'USEITEM_KEYBOARD';
    public static readonly PLAYER_SKILL = 'PLAYER_SKILL';
    public static readonly PLAYER_ATTACK = 'PLAYER_ATTACK';
    public static readonly PLAYER_REMOTEATTACK = 'PLAYER_REMOTEATTACK';
    public static readonly PLAYER_GETITEM = 'PLAYER_GETITEM';
    public static readonly PLAYER_TAPTIPS = 'PLAYER_TAPTIPS';
    public static readonly PLAYER_TAKEDAMAGE= 'PLAYER_TAKEDAMAGE';
    public static readonly PLAYER_CHANGEITEM= 'PLAYER_CHANGEITEM';
    public static readonly PLAYER_CHANGEEQUIPMENT= 'PLAYER_CHANGEEQUIPMENT';
    public static readonly PLAYER_STATUSUPDATE = 'PLAYER_STATUSUPDATE';
    public static readonly INVENTORY_CHANGEITEM = 'INVENTORY_CHANGEITEM';
    public static readonly LOADINGNEXTLEVEL= 'LOADINGNEXTLEVEL';
    public static readonly CHANGE_MINIMAP= 'CHANGE_MINIMAP';
    public static readonly LOADINGROOM= 'LOADINGROOM';
    public static readonly HUD_ADD_COIN = 'HUD_ADD_COIN';
    public static readonly HUD_ADD_OILGOLD = 'HUD_ADD_OILGOLD';
    public static readonly HUD_STOP_COUNTTIME = 'HUD_STOP_COUNTTIME';
    public static readonly HUD_LIGHT_CONTROLLER = 'HUD_LIGHT_CONTROLLER';
    public static readonly HUD_DARK_CONTROLLER = 'HUD_DARK_CONTROLLER';
    public static readonly HUD_CONTROLLER_COOLDOWN = 'HUD_CONTROLLER_COOLDOWN';
    public static readonly HUD_DAMAGE_CORNER_SHOW = 'HUD_DAMAGE_CORNER_SHOW';
    public static readonly HUD_GROUND_EQUIPMENT_INFO_SHOW = 'HUD_GROUND_EQUIPMENT_INFO_SHOW';
    public static readonly HUD_GROUND_EQUIPMENT_INFO_HIDE = 'HUD_GROUND_EQUIPMENT_INFO_HIDE';
    public static readonly DUNGEON_SETEQUIPMENT = 'DUNGEON_SETEQUIPMENT';
    public static readonly DUNGEON_ADD_ITEM = 'DUNGEON_ADD_ITEM';
    public static readonly DUNGEON_SHAKEONCE = 'DUNGEON_SHAKEONCE';
    public static readonly DUNGEON_ADD_COIN = 'DUNGEON_ADD_COIN';
    public static readonly DUNGEON_ADD_OILGOLD = 'DUNGEON_ADD_OILGOLD';
    public static readonly DUNGEON_ADD_FALLSTONE = 'DUNGEON_ADD_FALLSTONE';
    public static readonly MONSTER_STATUSUPDATE = 'MONSTER_STATUSUPDATE';
    public static readonly BOSS_ADDSLIME = 'BOSS_ADDSLIME';
    public static readonly HUD_UPDATE_PLAYER_INFODIALOG = 'HUD_UPDATE_PLAYER_INFO_DIALOG';
    public static readonly HUD_UPDATE_PLAYER_HEALTHBAR = 'HUD_UPDATE_PLAYER_HEALTHBAR';
    public static readonly TALENT_TREE_UPDATE = 'TALENT_TREE_UPDATE';
    public static readonly TALENT_TREE_SELECT = 'TALENT_TREE_SELECT';
    public static readonly PLAY_AUDIO = 'PLAY_AUDIO';
    public static readonly CAMERA_SHAKE = 'CAMERA_SHAKE';
    public static readonly CAMERA_LOOK = 'CAMERA_LOOK';
    public static readonly CHUNK_LOAD = 'CHUNK_LOAD';
    public static eventHandler:cc.Node = new cc.Node();
    
    /**
     * 自定义事件发送
     * @param key 
     * @param customDetail 
     */
    public static emit(key:string,customDetail:any){
        cc.director.emit(key, { detail: customDetail });
    }
    /**
     * 自定义事件接收
     * @param key 
     * @param callback 
     */
    public static on(key:string,callback:Function){
        cc.director.on(key, (event) => { callback(event.detail); });
    }
}
