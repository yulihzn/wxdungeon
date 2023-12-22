export default class TimeDelay {
    private delay = 0
    private checkTimeDelay = 0
    constructor(delay: number) {
        this.delay = delay > 0 ? delay : 0.016
    }
    check(dt: number): boolean {
        this.checkTimeDelay += dt
        if (this.checkTimeDelay > this.delay) {
            this.checkTimeDelay = 0
            return true
        }
        return false
    }
}
