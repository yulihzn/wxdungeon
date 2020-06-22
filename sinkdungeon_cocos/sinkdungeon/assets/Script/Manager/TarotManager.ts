import TarotCard from "../Item/TarotCard";
import Dungeon from "../Dungeon";
import IndexZ from "../Utils/IndexZ";

const { ccclass, property } = cc._decorator;
export default class TarotManager extends cc.Component{
    public static readonly THE_FOOL = "tarot00";
    public static readonly THE_MAGICIAN = "tarot01";
    public static readonly THE_HIGH_PRIESTESS = "tarot02";
    public static readonly THE_EMPRESS = "tarot03";
    public static readonly THE_EMPEROR = "tarot04";
    public static readonly THE_HIEROPHANT = "tarot05";
    public static readonly THE_LOVERS = "tarot06";
    public static readonly THE_CHARIOT = "tarot07";
    public static readonly STRENGTH = "tarot08";
    public static readonly THE_HERMIT = "tarot09";
    public static readonly THE_WHEEL_OF_FORTUNE = "tarot10";
    public static readonly JUSTICE = "tarot11";
    public static readonly THE_HANGEDMAN = "tarot12";
    public static readonly DEATH = "tarot13";
    public static readonly TEMPERANCE = "tarot14";
    public static readonly THE_DEVIL = "tarot15";
    public static readonly THE_TOWER = "tarot16";
    public static readonly THE_STAR = "tarot17";
    public static readonly THE_MOON = "tarot18";
    public static readonly THE_SUN = "tarot19";
    public static readonly JUDGEMENT = "tarot20";
    public static readonly THE_WORLD = "tarot21";
    @property(cc.Prefab)
    card: cc.Prefab = null;
    getCard(resName: string, pos: cc.Vec3):TarotCard{
        let cardPrefab = cc.instantiate(this.card);
        cardPrefab.parent = this.node;
        cardPrefab.position = Dungeon.getPosInMap(pos);
        cardPrefab.zIndex = IndexZ.getActorZIndex(cardPrefab.position);
        let card = cardPrefab.getComponent(TarotCard);
        card.data.resName = resName;
        return card;
    }
}