class Gem extends Item {
	public constructor(type: string) {
		super(type);
	}

	public isAutoPicking(): boolean {
		return true;
	}
	public use(): void {
		let score = parseInt(this.type.substring(this.type.length - 2, this.type.length));
		Logic.eventHandler.dispatchEventWith(LogicEvent.GET_GEM, false, { score: score * 10 });
	}
	public taken(finish): boolean {
		if (super.taken(finish)) {
			//tile所在的dungeon发消息
			this.use();
			return true;
		}
		return false;
	}
}