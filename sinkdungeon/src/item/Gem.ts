class Gem extends Item {
	public constructor(type: string) {
		super(type);
		this.useCount = 1;
	}

	public isAutoPicking(): boolean {
		return true;
	}
	public use(): boolean {
		if (super.use()) {
			let score = parseInt(this.type.substring(this.type.length - 2, this.type.length));
			this.parent.parent.dispatchEventWith(LogicEvent.GET_GEM, false, { score: score * 10 });
			return true;
		}
		return false;
	}
	public taken(): boolean {
		if (super.taken()) {
			//tile所在的dungeon发消息
			this.use();
			return true;
		}
		return false;
	}
}