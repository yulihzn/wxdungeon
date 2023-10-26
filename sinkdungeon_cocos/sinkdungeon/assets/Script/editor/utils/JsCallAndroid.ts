import EquipmentData from '../../data/EquipmentData'
import ItemData from '../../data/ItemData'
import PlayerData from '../../data/PlayerData'
import Logic from '../../logic/Logic'
import LocalStorage from '../../utils/LocalStorage'

export default class JsCallAndroid {
    players: { [key: string]: PlayerData } = {}
    equipments: { [key: string]: EquipmentData } = {}
    items: { [key: string]: ItemData } = {}
    static readonly FILENAME = 'players.json'
    loadPlayers() {
        let obj = this.loadJSON('players.json')
        if (obj) {
            this.players = obj
            for (let key in this.players) {
                this.players[key].id = key
            }
        }
    }
    loadEquipments() {
        // let obj = this.loadJSON('equipment.json')
        // if (obj) {
        //     this.equipments = obj
        //     for (let key in this.equipments) {
        //         if (!Logic.equipments[key]) {
        //             Logic.equipments[key] = this.equipments[key]
        //             Logic.equipmentNameList.push(key)
        //         }
        //     }
        // }
    }
    loadItems() {
        // let obj = this.loadJSON('item.json')
        // if (obj) {
        //     this.items = obj
        //     for (let key in this.items) {
        //         if (!Logic.items[key]) {
        //             if (Logic.items[key].canSave && key.indexOf('food') == -1 && key.indexOf('trash') == -1 && key.indexOf('doll') == -1 && key.indexOf('goods') == -1) {
        //                 Logic.itemNameList.push(key)
        //             } else if (key.indexOf('goods') != -1) {
        //                 Logic.goodsNameList.push(key)
        //             } else if (key.indexOf('trash') != -1) {
        //                 Logic.trashNameList.push(key)
        //             } else if (key.indexOf('doll') != -1) {
        //                 Logic.dollNameList.push(key)
        //             }
        //         }
        //     }
        // }
    }
    loadJSON(fileName: string) {
        let json = ''
        //@ts-ignore
        if (window.android) {
            //@ts-ignore
            json = window.android.getLocalJson(fileName)
        }
        if (!json || json.length < 1) {
            json = LocalStorage.getValue(fileName)
        }
        if (json && json.length > 0) {
            return JSON.parse(json)
        }
        return null
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
    loadEquipTexture() {
        this.loadTexture('equipment', (name: string) => {
            let index = name.indexOf('anim0')
            let key = name
            if (index != -1) {
                key = key.substring(0, index)
            }
            cc.log(key)
            if (!Logic.equipments[key]) {
                let data = new EquipmentData()
                data.img = key
                data.nameCn = key
                data.equipmetType = key.replace(/\d+$/, '')
                Logic.equipments[key] = data
                Logic.equipmentNameList.push(key)
            }
        })
    }
    loadItemTexture() {
        this.loadTexture('item', (key: string) => {
            if (!Logic.items[key]) {
                let data = new ItemData()
                data.resName = key
                data.nameCn = key
                Logic.items[key] = data
            }
        })
    }
    loadTexture(dirName: string, callback: (name: string) => void) {
        //@ts-ignore
        if (!window.android) {
            return
        }
        //@ts-ignore
        var imageList = window.android.getLocalImageList(dirName)
        var imageArray = imageList.split(';')
        imageArray.forEach(function (imagePath: string) {
            let arr = imagePath.split(',')
            let path = arr[0]
            let name = arr[1]
            if (!name || name.length < 1) {
                return
            }
            let index = name.indexOf('anim0')
            let key = name
            if (index != -1) {
                key = key.substring(0, index)
            }
            if (!Logic.spriteFrames[key]) {
                cc.assetManager.loadRemote('file://' + path, (err: Error, assert: cc.Texture2D) => {
                    if (err) {
                        cc.error(err)
                        return
                    }
                    assert.setFilters(cc.Texture2D.Filter.LINEAR, cc.Texture2D.Filter.LINEAR)
                    let spriteFrame = new cc.SpriteFrame(assert)
                    Logic.spriteFrames[key] = spriteFrame
                    cc.log(key + ':' + path)
                    callback(key)
                })
            }
        })
    }
}
