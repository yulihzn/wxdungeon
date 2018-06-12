class NpcManager {
	public constructor() {
	}
	public static getNpc(resName: string):Monster {
		let monster: Monster;
		switch (resName) {
			case NpcConstants.MONSTER_GOBLIN: monster = new Goblin(); break;
			case NpcConstants.MONSTER_MUMMY: monster = new Mummy(); break;
			case NpcConstants.MONSTER_ANUBIS: monster = new Anubis(); break;
		}
		return monster;
	}
}