class GemManager {
	public static readonly GEM01: number = 1;
	public static readonly GEM02: number = 2;
	public static readonly GEM03: number = 3;
	public static readonly GEM04: number = 4;
	private list: Gem[] = new Array();
	public constructor() {
	}
	
	public getGem(type: number): Gem {
		let gem: Gem;
		for (let i = 0; i < this.list.length; i++) {
			gem = this.list[i];
			if (!gem.visible) {
				gem.setId(type);
				return gem;
			}
		}
		gem = new Gem(type);
		this.list.push(gem)
		return gem;
	}
}