import DataUtils from '../utils/DataUtils'

export default class SettingsData {
    showSoftShadow = false
    showGamepad = true
    showEquipDialog = false
    lowPower = false
    isFlashLightOpen = false
    static readonly BPA = cc.v2(0, 0)
    static readonly BPR = cc.v2(0, 0)
    static readonly BPD = cc.v2(0, 0)
    static readonly BPJ = cc.v2(0, 0)
    static readonly BPI = cc.v2(0, 0)
    static readonly BPS1 = cc.v2(0, 0)
    static readonly BPS2 = cc.v2(0, 0)
    buttonPosAttack = SettingsData.BPA.clone()
    buttonPosRemote = SettingsData.BPR.clone()
    buttonPosJump = SettingsData.BPJ.clone()
    buttonPosDash = SettingsData.BPD.clone()
    buttonPosInteract = SettingsData.BPI.clone()
    buttonPosSkill1 = SettingsData.BPS1.clone()
    buttonPosSkill2 = SettingsData.BPS2.clone()
    public valueCopy(data: SettingsData): void {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data, true)
        this.copyPos(this.buttonPosAttack, data.buttonPosAttack, SettingsData.BPA)
        this.copyPos(this.buttonPosRemote, data.buttonPosRemote, SettingsData.BPR)
        this.copyPos(this.buttonPosDash, data.buttonPosDash, SettingsData.BPD)
        this.copyPos(this.buttonPosJump, data.buttonPosJump, SettingsData.BPJ)
        this.copyPos(this.buttonPosInteract, data.buttonPosInteract, SettingsData.BPI)
        this.copyPos(this.buttonPosSkill1, data.buttonPosSkill1, SettingsData.BPS1)
        this.copyPos(this.buttonPosSkill2, data.buttonPosSkill2, SettingsData.BPS2)
    }
    private copyPos(selfPos: cc.Vec2, otherPos: cc.Vec2, defaultPos: cc.Vec2) {
        selfPos = otherPos ? cc.v2(otherPos.x, otherPos.y) : defaultPos.clone()
    }
    public allButtonPosReset() {
        this.copyPos(this.buttonPosAttack, undefined, SettingsData.BPA)
        this.copyPos(this.buttonPosRemote, undefined, SettingsData.BPR)
        this.copyPos(this.buttonPosDash, undefined, SettingsData.BPD)
        this.copyPos(this.buttonPosJump, undefined, SettingsData.BPJ)
        this.copyPos(this.buttonPosSkill1, undefined, SettingsData.BPS1)
        this.copyPos(this.buttonPosSkill2, undefined, SettingsData.BPS2)
    }

    public clone(): SettingsData {
        let e = new SettingsData()
        e.valueCopy(this)

        return e
    }
}
