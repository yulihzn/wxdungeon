import { EventHelper } from './../logic/EventHelper'
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Logic from '../logic/Logic'
import Random from '../utils/Random'

const { ccclass, property } = cc._decorator

@ccclass
export default class LoadingIcon extends cc.Component {
    public static readonly TYPE_MAP = 0
    public static readonly TYPE_NPC = 1
    public static readonly TYPE_EQUIP = 2
    public static readonly TYPE_ITEM = 3
    public static readonly TYPE_AUDIO = 4
    public static readonly TYPE_TEXTURE = 5
    public static readonly TYPE_TEXTURE_AUTO = 6

    @property(cc.Label)
    label1: cc.Label = null
    @property(cc.Node)
    icon: cc.Node = null
    @property(cc.Label)
    label2: cc.Label = null
    isFirst = false
    static WORDS = [
        `梦是大自然所作的聪明的安排,为了在基于意志的身体运动即肌肉运动暂时休息时,用不随意虚构出来的事物所产生的激情去刺激生命力。`,
        `一方面,梦是反映生活的;另一方面,梦又是远离生活的。它以夸张、歪曲、甚至变形的方式反映生活。`,
        `梦把人们从桎梏般的现实中,释放了出来,使他自由,使他在云中翱翔,使他在山峰上奔走。`,
        `偶然做个白昼梦,想入非非,任想象去驰骋,获得一时的慰安,当然亦无不可,但是究竟只是一时有效的镇定剂,可以暂时止痛,但不根本治疗。`,
        `梦与觉、醉与醒、幻与真、虚与实、显与隐、形与迹、光与影、暗与明,都是生活里一事的两面,互相依存,而泾渭自分。`,
        `梦是不可思议的,也是不可捉摸的,既无法预料,也无法选择和控制。`,
        `做噩梦时,痛苦或恐怖达到最高度,恐怖的本身便促使我们觉醒,梦中的妖魔鬼怪也接着消灭。在人生的梦中情形亦复如此。`,
        `梦是不连贯的,它毫不迟疑地调和着荒谬的矛盾,它接受不可能性,漠视清醒状态时的权威性认识,而且它向我们显示对伦理道德的迟钝`,
        `那永久沉睡的并非死者，在漫长而奇异的时光中，死亡亦有其终结。`,
        `这个世界最仁慈的地方，莫过于人类思维无法融会贯通它的全部内容。`,
        `永远躺下的并没有死去，在神秘的万古中即便是死亡也可以死去。`,
        `人类居住在幽暗的海洋中一个名为无知的小岛上，这海洋浩淼无垠、蕴藏无穷秘密，但我们并不应该航行过远，探究太深。`,
        `为什么失眠呢\n因为怕那个梦\n那个不是噩梦的噩梦。`,
        `能给别人带来噩梦的人，他自己往往要承载着更多的噩梦。\n所以那既是一个怪物，更是一个可怜的受害者。`,
        `与怪物战斗的人，应当小心自己不要成为怪物。\n当你远远凝视深渊时，深渊也在凝视你。`,
        `精神分析有三大支柱：潜意识的心理机制，反抗和压抑的作用，以及性的重要性。`,
        `梦有时会通过一种非常神奇的复制能力，让我们回想起遥远的事物，甚至是我们已经忘记的自己。`,
        `事实上，梦之所以被修改成不愉快的，是因为有些梦是精神的第二步所不允许的，而这些正是精神的第一步所需要的欲望。`,
        `在我们的梦中出现的是我们在外部世界或自身经历的。`,
        `每一个梦都起源于第一种力量（欲望），但受到了第二种力量（意识）的防御和抵制。`,
        `梦是一个人与自己内心的真实对话，是向自己学习的过程，是另一次与自己息息相关的人生。`,
        `一切的不如意不了解,都可以用一层薄幕去遮蔽,这层薄幕,我们可以说是梦。`
    ]
    @property(cc.Node)
    layout: cc.Node = null
    @property(cc.Node)
    map0: cc.Node = null
    @property(cc.Node)
    map1: cc.Node = null
    @property(cc.Node)
    npc0: cc.Node = null
    @property(cc.Node)
    npc1: cc.Node = null
    @property(cc.Node)
    equip0: cc.Node = null
    @property(cc.Node)
    equip1: cc.Node = null
    @property(cc.Node)
    item0: cc.Node = null
    @property(cc.Node)
    item1: cc.Node = null
    @property(cc.Node)
    audio0: cc.Node = null
    @property(cc.Node)
    audio1: cc.Node = null
    @property(cc.Node)
    texture0: cc.Node = null
    @property(cc.Node)
    texture1: cc.Node = null
    @property(cc.Node)
    textureauto0: cc.Node = null
    @property(cc.Node)
    textureauto1: cc.Node = null
    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.isFirst = Logic.isFirstLoading
        this.getComponent(cc.Animation).play(Logic.isFirstLoading ? 'LoadingIconWithLabel' : 'LoadingIcon')
        this.label2.string = `${LoadingIcon.WORDS[Random.getRandomNum(0, LoadingIcon.WORDS.length - 1)]}`
        EventHelper.on(EventHelper.LOADING_ICON, detail => {
            if (this.node) {
                switch (detail.type) {
                    case LoadingIcon.TYPE_MAP:
                        this.mapLoaded()
                        break
                    case LoadingIcon.TYPE_NPC:
                        this.npcLoaded()
                        break
                    case LoadingIcon.TYPE_EQUIP:
                        this.equipLoaded()
                        break
                    case LoadingIcon.TYPE_ITEM:
                        this.itemLoaded()
                        break
                    case LoadingIcon.TYPE_AUDIO:
                        this.audioLoaded()
                        break
                    case LoadingIcon.TYPE_TEXTURE:
                        this.textureLoaded()
                        break
                    case LoadingIcon.TYPE_TEXTURE_AUTO:
                        this.textureautoLoaded()
                        break
                }
            }
        })
    }
    private iconShow(node0: cc.Node, node1: cc.Node) {
        cc.tween(node0).to(0.1, { scale: 0.8 }).to(0.1, { scale: 2 }).to(0.1, { scale: 1 }).start()
        cc.tween(node1).to(0.3, { opacity: 255 }).start()
    }
    init(includeArr: number[]) {
        let arr = [this.map0, this.npc0, this.equip0, this.item0, this.audio0, this.texture0, this.textureauto0, this.audio0]
        for (let icon of arr) {
            icon.active = false
        }
        for (let index of includeArr) {
            if (index >= 0 && index < arr.length) {
                arr[index].active = true
            }
        }
    }
    private mapLoaded() {
        this.iconShow(this.map0, this.map1)
    }
    private npcLoaded() {
        this.iconShow(this.npc0, this.npc1)
    }
    private equipLoaded() {
        this.iconShow(this.equip0, this.equip1)
    }
    private itemLoaded() {
        this.iconShow(this.item0, this.item1)
    }
    private audioLoaded() {
        this.iconShow(this.audio0, this.audio1)
    }
    private textureLoaded() {
        this.iconShow(this.texture0, this.texture1)
    }
    private textureautoLoaded() {
        this.iconShow(this.textureauto0, this.textureauto1)
    }

    start() {
        Logic.isFirstLoading = false
    }

    // update(dt) {}
}
