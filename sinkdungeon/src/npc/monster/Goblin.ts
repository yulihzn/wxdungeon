class Goblin extends Monster{
	public constructor() {
		super(NpcConstants.MONSTER_GOBLIN);
		this.maxHealth = 1;
		this.currentHealth = 1;
		this.healthBar.refreshHealth(this.currentHealth,this.maxHealth);
	}
}