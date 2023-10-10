import PlayerData from '../../data/PlayerData'
import LocalStorage from '../../utils/LocalStorage'

export default class JsCallAndroid {
    players: { [key: string]: PlayerData } = {}
    static readonly FILENAME = 'players.json'
    loadPlayers() {
        let json = ''
        //@ts-ignore
        if (window.android) {
            //@ts-ignore
            json = window.android.getLocalJson(JsCallAndroid.FILENAME)
        }
        if (!json || json.length < 1) {
            json = LocalStorage.getValue(JsCallAndroid.FILENAME)
        }
        if (json && json.length > 0) {
            this.players = JSON.parse(json)
            for (let key in this.players) {
                this.players[key].id = key
            }
        }
    }
    getPlayerDataById(id: string): PlayerData {
        if (this.players && this.players[id]) {
            return this.players[id]
        } else {
            return null
        }
    }
    savePlayerDataById(data: PlayerData) {
        this.players[data.id] = data
        //@ts-ignore
        if (window.android) {
            //@ts-ignore
            window.android.saveJsonData(JsCallAndroid.FILENAME, JSON.stringify(this.players))
        } else {
            LocalStorage.putValue(JsCallAndroid.FILENAME, this.players)
        }
    }
}
