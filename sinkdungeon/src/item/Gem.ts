class Gem extends Item {
	public constructor(type: number) {
		super(type);
	}
	public changeRes(type: number): void {
		this.type = type;
		this.item.texture = RES.getRes("gem0" + this.type)
	}
	public getType(): number {
		return this.type;
	}
	public isAutoPicking(): boolean {
		return true;
	}

	public taken(): boolean {
		if (super.taken()) {
			//tile所在的dungeon发消息
			this.parent.parent.dispatchEventWith(LogicEvent.GET_GEM, false, { score: this.type * 10 });
			return true;
		}
		return false;
	}
}