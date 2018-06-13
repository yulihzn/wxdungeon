class Shield extends Item {
	public constructor(type: string) {
		super(type);
		this.isInfinity = true;
		this.item.scaleX = 2;
		this.item.scaleY = 2;
		this.data.defence = 1;
	}

	public isAutoPicking(): boolean {
		return false;
	}

	public use(): void {
		Logic.eventHandler.dispatchEventWith(LogicEvent.DAMAGE_PLAYER, false, { damage: -1 });

	}

	public taken(finish): boolean {
		if (super.taken(finish)) {
			//tile所在的dungeon发消息
			return true;
		}
		return false;
	}
}