import DataUtils from '../utils/DataUtils'
import BaseData from './BaseData'
import ProfessionData from './ProfessionData'

export default class AvatarData extends BaseData {
    static readonly FOLLOWER = 0
    static readonly HUNTER = 1
    static readonly GURAD = 2
    static readonly TECH = 3
    static readonly ORGANIZATION = ['弥世逐流', '宝藏猎人', '幽光守护', '翠金科技']
    organizationIndex: number = 0 //['弥世逐流','宝藏猎人','幽光守护','翠金科技']
    professionData: ProfessionData = new ProfessionData()
    skinColor: string = '#ffe1c5'
    hairResName: string = 'avatarhair000'
    hairColor: string = '#000000'
    eyesResName: string = 'avatareyes000'
    eyesColor: string = '#000000'
    faceResName: string = 'avatarface000'
    faceColor: string = '#FBA1DE'
    petName: string = 'nonplayer100'

    isAnimFrame: boolean = false
    idleFrames = [0, 1]
    walkFrames = [2, 5]
    hitFrames = [6, 7]
    dieFrames = [8]
    attackFrames = [9, 10]
    specialFrames = [11, 12]
    disguiseFrames = [13]

    public valueCopy(data: AvatarData): void {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data, true)
        this.professionData.valueCopy(data.professionData)
        this.copyArray(this.idleFrames, data.idleFrames)
        this.copyArray(this.walkFrames, data.walkFrames)
        this.copyArray(this.dieFrames, data.dieFrames)
        this.copyArray(this.disguiseFrames, data.disguiseFrames)
        this.copyArray(this.attackFrames, data.attackFrames)
        this.copyArray(this.specialFrames, data.specialFrames)
        this.copyArray(this.hitFrames, data.hitFrames)
    }
    private copyArray(arr1: number[], arr2: number[]) {
        if (arr2 && arr2.length > 0) {
            arr1 = arr2
        }
    }
    public clone(): AvatarData {
        let e = new AvatarData()
        e.valueCopy(this)

        return e
    }
}
