export default class AchievementData{
    index = 0;
    monsters :{[key:string]:number}={};
    items:{[key:string]:number}={};
    equips:{[key:string]:number}={};
    npcs:{[key:string]:number}={};
    maps:{[key:string]:number}={};
    challenges:{[key:string]:number}={};
    furnitures:{[key:string]:number}={};
    playerLifes = 0;
    valueCopy(data:AchievementData){
        this.index = data.index?data.index:0;
        this.monsters = data.monsters?data.monsters:{};
        this.items = data.monsters?data.monsters:{};
        this.equips = data.monsters?data.monsters:{};
        this.npcs = data.monsters?data.monsters:{};
        this.maps = data.monsters?data.monsters:{};
        this.challenges = data.monsters?data.monsters:{};
        this.furnitures = data.monsters?data.monsters:{};
        this.playerLifes = data.playerLifes?data.playerLifes:0;
    }
}