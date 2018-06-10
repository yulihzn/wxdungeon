class Capsule extends Item {
	public constructor(type: string) {
		super(type);
		this.useCount = 1;
	}
	
	public isAutoPicking(): boolean {
		return false;
	}

	public use():boolean{
		if(super.use()){
			this.parent.parent.dispatchEventWith(LogicEvent.DAMAGE_PLAYER, false, { damage: -1});
			return true;
		}
		return false;
	}

	public taken(): boolean {
		if (super.taken()) {
			//tile所在的dungeon发消息
			return true;
		}
		return false;
	}
}