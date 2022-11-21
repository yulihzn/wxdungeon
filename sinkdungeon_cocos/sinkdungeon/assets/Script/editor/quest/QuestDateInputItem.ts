// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default class QuestDateInputItem extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null

    @property(cc.EditBox)
    editYear: cc.EditBox = null
    @property(cc.EditBox)
    editMonth: cc.EditBox = null
    @property(cc.EditBox)
    editDay: cc.EditBox = null
    @property(cc.EditBox)
    editHour: cc.EditBox = null
    @property(cc.EditBox)
    editMinute: cc.EditBox = null
    @property(cc.EditBox)
    editSecond: cc.EditBox = null
    // LIFE-CYCLE CALLBACKS:

    onLoad() {}

    get Value() {
        let year = this.getYear()
        let month = this.getMonth()
        let day = this.getDay()
        let hour = this.getNumFromEdit(this.editHour, 0, 23)
        let minute = this.getNumFromEdit(this.editMinute, 0, 59)
        let second = this.getNumFromEdit(this.editSecond, 0, 59)
        let date = new Date(`${year}-${month}-${day} ${hour}:${minute}:${second}`)
        return date.getTime()
    }
    set Value(value: number) {
        let date = new Date(value)
        this.editYear.string = `${date.getFullYear()}`
        this.editMonth.string = `${date.getMonth() + 1}`
        this.editDay.string = `${date.getDate()}`
        this.editHour.string = `${date.getHours()}`
        this.editMinute.string = `${date.getMinutes()}`
        this.editSecond.string = `${date.getSeconds()}`
    }
    private getNumFromEdit(editBox: cc.EditBox, min: number, max: number) {
        let num = parseInt(editBox.string)
        num = isNaN(num) ? 0 : num
        if (num > max) {
            num = max
        }
        if (num < min) {
            num = min
        }
        return num
    }
    private getYear() {
        return this.getNumFromEdit(this.editYear, 1970, 9999)
    }
    private getMonth() {
        return this.getNumFromEdit(this.editMonth, 1, 12)
    }
    private getDay() {
        let d = new Date(this.getYear(), this.getMonth(), 0)
        return this.getNumFromEdit(this.editDay, 1, d.getDate())
    }
    start() {}

    onTextChanged(text: string, editbox: cc.EditBox, customEventData) {
        if (editbox == this.editYear) {
            editbox.string = `${this.getYear()}`
            this.editDay.string = `${this.getDay()}`
        } else if (editbox == this.editMonth) {
            editbox.string = `${this.getMonth()}`
            this.editDay.string = `${this.getDay()}`
        } else if (editbox == this.editDay) {
            editbox.string = `${this.getDay()}`
        } else if (editbox == this.editHour) {
            editbox.string = `${this.getNumFromEdit(this.editHour, 0, 23)}`
        } else if (editbox == this.editMinute) {
            editbox.string = `${this.getNumFromEdit(this.editMinute, 0, 59)}`
        } else if (editbox == this.editSecond) {
            editbox.string = `${this.getNumFromEdit(this.editSecond, 0, 59)}`
        }
    }
}
