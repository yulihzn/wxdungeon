const { ccclass, property } = cc._decorator
@ccclass
export class EventHelper extends cc.Component {
    public static readonly PLAYER_MOVE = 'PLAYER_MOVE'
    public static readonly PLAYER_ROTATE = 'PLAYER_ROTATE'
    public static readonly PLAYER_TRIGGER = 'PLAYER_TRIGGER'
    public static readonly PLAYER_USEITEM = 'PLAYER_USEITEM'
    public static readonly USEITEM_KEYBOARD = 'USEITEM_KEYBOARD'
    public static readonly KEYBOARD_INTERACT = 'KEYBOARD_INTERACT'
    public static readonly KEYBOARD_MOVE = 'KEYBOARD_MOVE'
    public static readonly PLAYER_SKILL = 'PLAYER_SKILL'
    public static readonly PLAYER_SKILL1 = 'PLAYER_SKILL1'
    public static readonly PLAYER_ATTACK = 'PLAYER_ATTACK'
    public static readonly PLAYER_REMOTEATTACK = 'PLAYER_REMOTEATTACK'
    public static readonly PLAYER_REMOTEATTACK_CANCEL = 'PLAYER_REMOTEATTACK_CANCEL'
    public static readonly PLAYER_JUMP = 'PLAYER_JUMP'
    public static readonly PLAYER_JUMP_CANCEL = 'PLAYER_JUMP_CANCEL'
    public static readonly PLAYER_DASH = 'PLAYER_DASH'
    public static readonly PLAYER_GETITEM = 'PLAYER_GETITEM'
    public static readonly PLAYER_USEDREAM = 'PLAYER_USEDREAM'
    public static readonly PLAYER_CHANGEITEM = 'PLAYER_CHANGEITEM'
    public static readonly PLAYER_CHANGEEQUIPMENT = 'PLAYER_CHANGEEQUIPMENT'
    public static readonly PLAYER_EQUIPMENT_REFRESH = 'PLAYER_EQUIPMENT_REFRESH'
    public static readonly PLAYER_ITEM_REFRESH = 'PLAYER_ITEM_REFRESH'
    public static readonly PLAYER_STATUSUPDATE = 'PLAYER_STATUSUPDATE'
    public static readonly PLAYER_UPDATE_OILGOLD_DATA = 'PLAYER_UPDATE_OILGOLD_DATA'
    public static readonly PLAYER_SHOW_FLASHLIGHT = 'PLAYER_SHOW_FLASHLIGHT'
    public static readonly INVENTORY_CHANGEITEM = 'INVENTORY_CHANGEITEM'
    public static readonly CHANGE_MINIMAP = 'CHANGE_MINIMAP'
    public static readonly OPEN_MINIMAP = 'OPEN_MINIMAP'
    public static readonly HUD_ADD_COIN = 'HUD_ADD_COIN'
    public static readonly HUD_ADD_REAL_COIN = 'HUD_ADD_REAL_COIN'
    public static readonly HUD_ADD_OILGOLD = 'HUD_ADD_OILGOLD'
    public static readonly HUD_LOSE_OILGOLD = 'HUD_LOSE_OILGOLD'
    public static readonly HUD_OILGOLD_LOSE_SHOW = 'HUD_OILGOLD_LOSE_SHOW'
    public static readonly HUD_OILGOLD_RECOVERY_SHOW = 'HUD_OILGOLD_RECOVERY_SHOW'
    public static readonly HUD_STOP_COUNTTIME = 'HUD_STOP_COUNTTIME'
    public static readonly HUD_LIGHT_CONTROLLER = 'HUD_LIGHT_CONTROLLER'
    public static readonly HUD_CHANGE_CONTROLLER_SHIELD = 'HUD_CHANGE_CONTROLLER_SHIELD'
    public static readonly HUD_CONTROLLER_COOLDOWN = 'HUD_CONTROLLER_COOLDOWN'
    public static readonly HUD_CONTROLLER_UPDATE_GAMEPAD = 'HUD_CONTROLLER_UPDATE_GAMEPAD'
    public static readonly HUD_CONTROLLER_INTERACT_SHOW = 'HUD_CONTROLLER_INTERACT_SHOW'
    public static readonly HUD_CONTROLLER_REMOTE_SHOW = 'HUD_CONTROLLER_REMOTE_SHOW'
    public static readonly HUD_DAMAGE_CORNER_SHOW = 'HUD_DAMAGE_CORNER_SHOW'
    public static readonly HUD_GROUND_EQUIPMENT_INFO_SHOW = 'HUD_GROUND_EQUIPMENT_INFO_SHOW'
    public static readonly HUD_GROUND_EQUIPMENT_INFO_HIDE = 'HUD_GROUND_EQUIPMENT_INFO_HIDE'
    public static readonly HUD_GROUND_ITEM_INFO_SHOW = 'HUD_GROUND_ITEM_INFO_SHOW'
    public static readonly HUD_GROUND_ITEM_INFO_HIDE = 'HUD_GROUND_ITEM_INFO_HIDE'
    public static readonly HUD_FADE_IN = 'HUD_FADE_IN'
    public static readonly HUD_FADE_OUT = 'HUD_FADE_OUT'
    public static readonly HUD_COMPLETE_SHOW = 'HUD_COMPLETE_SHOW'
    public static readonly HUD_DOLL_MACHINE_DIALOG = 'HUD_DOLL_MACHINE_DIALOG'
    public static readonly HUD_QUEST_BOARD_SHOW = 'HUD_QUEST_BOARD_SHOW'
    public static readonly HUD_METAL_TALENT_SHOW = 'HUD_METAL_TALENT_SHOW'
    public static readonly HUD_MART_SHELVES_DIALOG = 'HUD_MART_SHELVES_DIALOG'
    public static readonly HUD_MART_SHELVES_DIALOG_PAY = 'HUD_MART_SHELVES_DIALOG_BUY'
    public static readonly HUD_CAMERA_ZOOM_IN = 'HUD_CAMERA_ZOOM_IN'
    public static readonly HUD_CAMERA_ZOOM_OUT = 'HUD_CAMERA_ZOOM_OUT'
    public static readonly HUD_CAMERA_ZOOM_IN_LOCK = 'HUD_CAMERA_ZOOM_IN_LOCK'
    public static readonly HUD_CANCEL_OR_PAUSE = 'HUD_CANCEL_OR_PAUSE'
    public static readonly HUD_DIALOGUE_SKIP = 'HUD_DIALOGUE_SKIP'
    public static readonly HUD_DIALOGUE_BUTTON = 'HUD_DIALOGUE_BUTTON'
    public static readonly DUNGEON_SETEQUIPMENT = 'DUNGEON_SETEQUIPMENT'
    public static readonly DUNGEON_ADD_ITEM = 'DUNGEON_ADD_ITEM'
    public static readonly DUNGEON_SHAKEONCE = 'DUNGEON_SHAKEONCE'
    public static readonly DUNGEON_ADD_COIN = 'DUNGEON_ADD_COIN'
    public static readonly DUNGEON_ADD_OILGOLD = 'DUNGEON_ADD_OILGOLD'
    public static readonly DUNGEON_ADD_FALLSTONE = 'DUNGEON_ADD_FALLSTONE'
    public static readonly DUNGEON_ADD_LIGHTENINGFALL = 'DUNGEON_ADD_LIGHTENINGFALL'
    public static readonly DUNGEON_ADD_FLOORPAPER = 'DUNGEON_ADD_FLOORPAPER'
    public static readonly DUNGEON_WALL_COLLIDER = 'DUNGEON_WALL_COLLIDER'
    public static readonly DUNGEON_DISAPPEAR = 'DUNGEON_DISAPPEAR'
    public static readonly MONSTER_STATUSUPDATE = 'MONSTER_STATUSUPDATE'
    public static readonly BOSS_ADDSLIME = 'BOSS_ADDSLIME'
    public static readonly HUD_UPDATE_PLAYER_INFODIALOG = 'HUD_UPDATE_PLAYER_INFO_DIALOG'
    public static readonly HUD_UPDATE_PLAYER_HEALTHBAR = 'HUD_UPDATE_PLAYER_HEALTHBAR'
    public static readonly HUD_UPDATE_PLAYER_DREAMBAR = 'HUD_UPDATE_PLAYER_DREAMBAR'
    public static readonly HUD_SHAKE_PLAYER_DREAMBAR = 'HUD_SHAKE_PLAYER_DREAMBAR'
    public static readonly HUD_UPDATE_PLAYER_LIFE_BAR = 'HUD_UPDATE_PLAYER_LIFE_BAR'
    public static readonly HUD_UPDATE_PLAYER_AMMO = 'HUD_UPDATE_PLAYER_AMMO'
    public static readonly HUD_INVENTORY_SHOW = 'HUD_INVENTORY_SHOW'
    public static readonly HUD_CELLPHONE_SHOW = 'HUD_CELLPHONE_SHOW'
    public static readonly HUD_ACTION_SETTING_DIALOG = 'HUD_ACTION_SETTING_DIALOG'
    public static readonly HUD_INVENTORY_SELECT_UPDATE = 'HUD_INVENTORY_SELECT_UPDATE'
    public static readonly HUD_INVENTORY_ITEM_UPDATE = 'HUD_INVENTORY_ITEM_UPDATE'
    public static readonly HUD_INVENTORY_EQUIP_UPDATE = 'HUD_INVENTORY_EQUIP_UPDATE'
    public static readonly HUD_INVENTORY_ALL_UPDATE = 'HUD_INVENTORY_ALL_UPDATE'
    public static readonly HUD_TOAST = 'HUD_TOAST'
    public static readonly HUD_TIME_TICK = 'HUD_TIME_TICK'
    public static readonly HUD_DIALOGUE_SHOW = 'HUD_DIALOGUE_SHOW'
    public static readonly HUD_FURNITURE_REFRESH = 'HUD_FURNITURE_REFRESH'
    public static readonly HUD_SHOW_FLOATING_LABEL = 'HUD_SHOW_FLOATING_LABEL'
    public static readonly POOL_DESTROY_LABEL = 'POOL_DESTROY_LABEL'
    public static readonly TALENT_TREE_UPDATE = 'TALENT_TREE_UPDATE'
    public static readonly TALENT_TREE_SELECT = 'TALENT_TREE_SELECT'
    public static readonly PLAY_AUDIO = 'PLAY_AUDIO'
    public static readonly STOP_ALL_AUDIO_EFFECT = 'STOP_ALL_AUDIO_EFFECT'
    public static readonly STOP_AUDIO_EFFECT = 'STOP_AUDIO_EFFECT'
    public static readonly CAMERA_SHAKE = 'CAMERA_SHAKE'
    public static readonly CAMERA_LOOK = 'CAMERA_LOOK'
    public static readonly CHUNK_LOAD = 'CHUNK_LOAD'
    public static readonly POOL_DESTORY_WALKSMOKE = 'destorysmoke'
    public static readonly POOL_DESTORY_BLOCKLIGHT = 'destoryblocklight'
    public static readonly POOL_DESTORY_FIREGHLOST = 'destoryfireghost'
    public static readonly POOL_DESTORY_REFLECTLIGHT = 'destoryreflectlight'
    public static readonly POOL_DESTORY_HIT_BLOOD = 'POOL_DESTORY_HIT_BLOOD'
    public static readonly TEST_SHOW_NODE_COUNT = 'TEST_SHOW_NODE_COUNT'
    public static readonly SETTINGS_LOW_POWER = 'SETTINGS_LOW_POWER'
    public static readonly LOADING_ICON = 'LOADING_ICON'
    public static readonly EDITOR_SHOW_SPRITE_INFO = 'EDITOR_SHOW_SPRITE_INFO'

    public static readonly DIALOG_ALERT_SHOW = 'DIALOG_ALERT_SHOW'

    public static readonly GAMEOVER_WAKEUP = 'GAMEOVER_WAKEUP'
    public static readonly SELECT_METAL_TALENT = 'SELECT_METAL_TALENT'

    public static eventHandler: cc.Node = new cc.Node()

    /**
     * 自定义事件发送
     * @param key
     * @param customDetail
     */
    public static emit(key: string, customDetail?: any) {
        if (customDetail) {
            cc.director.emit(key, { detail: customDetail })
        } else {
            cc.director.emit(key)
        }
    }

    /**
     * 自定义事件接收
     * @param key
     * @param callback
     */
    public static on(key: string, callback: Function) {
        cc.director.on(key, event => {
            callback(event ? event.detail : {})
        })
    }
    /**
     * 自定义事件取消
     * @param key
     * @param callback
     */
    public static off(key: string) {
        cc.director.off(key)
    }
}
