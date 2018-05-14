// components/talk-dialog/talk-dialog.js
var toBattle = [
  {
    id: 0, title: "", content: "战斗开始",
    options: [{ text: "战斗", nextId: -1, callback: function (tile, logic) {
       tile.battle(logic) 
       } },
      { text: "取消", nextId: -1, callback: function (tile, logic) {  } }]
  },
]
var toBattle1 = [
  {
    id: 0, title: "", content: "战斗开始",
    options: [{
      text: "战斗", nextId: -1, callback: function (tile, logic) {
        tile.battle(logic)
      }
    }]
  },
]
var toStore = [
  {
    id: 0, title: "", content: "你好啊，勇者，随便看看~",
    options: [{
      text: "查看", nextId: -1, callback: function (tile, logic) {
        
      }
    },
    { text: "取消", nextId: -1, callback: function (tile, logic) { } }]
  },
]
var toStoreQuest = [
  {
    id: 0, title: "", content: "你好啊，勇者，随便看看~",
    options: [{text: "查看", nextId: -1, callback: function (tile, logic) {}}
    ,{ text: "取消", nextId: -1, callback: function (tile, logic) { } }
      , { text: "卖出", nextId: -1, callback: function (tile, logic) { } }
      , { text: "好大一只老鼠", nextId: 1, callback: function (tile, logic) {} }]
  },
  {
    id: 1, title: "", content: "什么大老鼠，这是可是一只南美大水獭！（它咕噜咕噜地叫唤了起来）\n可是最近它的食量越来越大了，你能帮我去抓10只老鼠吗？我会给你报酬的。",
    options: [{ text: "很乐意帮你这个忙", nextId: 2, callback: function (tile, logic) { } }
      , { text: "我有点忙啊，暂时帮不了你", nextId: -1, callback: function (tile, logic) { } }]
  },
  {
    id: 2, title: "", content: "再见，勇者！",
    options: [{ text: "再见", nextId: -1, callback: function (tile, logic) { } }]
  },
]
var toStoreQuest1 = [
  {
    id: 0, title: "大水獭", content: "咕噜~咕噜？",
    options: [{ text: "查看", nextId: -1, callback: function (tile, logic) { } }
      , { text: "取消", nextId: -1, callback: function (tile, logic) { } }
      , { text: "卖出", nextId: -1, callback: function (tile, logic) { } }
      , { text: "老板人呢？", nextId: 1, callback: function (tile, logic) { } }]
  },
  {
    id: 1, title: "大水獭", content: "你把老鼠直接扔在桌上了。\n大水獭：咕噜~咕噜~咕噜~咕噜~",
    options: [{ text: "我的报酬咧？", nextId: 2, callback: function (tile, logic) { } }
      , { text: "咕噜咕噜？", nextId: 3, callback: function (tile, logic) { } }]
  },
  {
    id: 2, title: "大水獭", content: "咕噜~咕噜！（眨了眨眼，望着桌子上的金币）",
    options: [{ text: "拿走金币", nextId: -1, callback: function (tile, logic) { } }
      , { text: "难道老板被你吃了,我要为她报仇！", nextId: -1, callback: function (tile, logic) { logic.setKillStore(true), tile.battle(logic)}}]
  },
  {
    id: 3, title: "大水獭", content: "咕噜~咕噜！\n（水獭拿着一根破烂的围巾，你注意到那是商店老板的）",
    options: [{ text: "咕噜咕噜？", nextId: 4, callback: function (tile, logic) { } }
      , { text: "难道老板被你吃了,我要为她报仇！", nextId: -1, callback: function (tile, logic) { logic.setKillStore(true), tile.battle(logic)} }]
  },
  {
    id: 4, title: "大水獭", content: "咕噜~咕噜！\n（水獭看起来有点凶悍）",
    options: [{ text: "咕噜咕噜？", nextId: 5, callback: function (tile, logic) { } }
      , { text: "难道老板被你吃了,我要为她报仇！", nextId: -1, callback: function (tile, logic) { logic.setKillStore(true), tile.battle(logic) } }]
  },
  {
    id: 5, title: "大水獭", content: "咕噜~咕噜！\n（水獭露出了他锋利的牙齿看着我）",
    options: [{ text: "咕噜咕噜？", nextId: 6, callback: function (tile, logic) { } }
      , { text: "难道老板被你吃了,我要为她报仇！", nextId: -1, callback: function (tile, logic) { logic.setKillStore(true), tile.battle(logic) } }]
  },
  {
    id: 6, title: "大水獭", content: "咕噜~咕噜！\n（水獭吐出了一个道具）",
    options: [{ text: "拿走道具", nextId: -1, callback: function (tile, logic) { } }
      , { text: "难道老板被你吃了,我要为她报仇！", nextId: -1, callback: function (tile, logic) { logic.setKillStore(true), tile.battle(logic) } }]
  },
]
var toStoreQuest2 = [
  {
    id: 0, title: "", content: "你好啊，勇者，随便看看...",
    options: [{ text: "查看", nextId: -1, callback: function (tile, logic) { } }
      , { text: "取消", nextId: -1, callback: function (tile, logic) { } }
      , { text: "卖出", nextId: -1, callback: function (tile, logic) { } }
      , { text: "你好", nextId: 1, callback: function (tile, logic) { } }]
  },
  {
    id: 1, title: "", content: "我的水獭被人杀死了，不知道哪个天杀的，你有看到么？",
    options: [{ text: "没有", nextId: 2, callback: function (tile, logic) { } }
      , { text: "怎么回事？", nextId: 3, callback: function (tile, logic) { } }]
  },
  {
    id: 2, title: "", content: "好吧，随便看看",
    options: [{ text: "好的", nextId: 0, callback: function (tile, logic) { } }
      , { text: "再见", nextId: -1, callback: function (tile, logic) { } }]
  },
  {
    id: 3, title: "", content: "什么叫我没死？有一天我出去进货了，回来的时候发现了我的水獭死掉了，难道是你干的？",
    options: [{ text: "啊，怎么会，我不知道...", nextId: -1, callback: function (tile, logic) { if (Math.random() > 0.5) { tile.battle(logic)}} }
      , { text: "今天的天气不错啊", nextId: -1, callback: function (tile, logic) { if (Math.random() > 0.5) { tile.battle(logic) } } }]
  },
]
var toStoreQuest3 = [
  {
    id: 0, title: "", content: "你好啊，勇者，随便看看...",
    options: [{ text: "查看", nextId: -1, callback: function (tile, logic) { } }
      , { text: "取消", nextId: -1, callback: function (tile, logic) { } }
      , { text: "卖出", nextId: -1, callback: function (tile, logic) { } }
      , { text: "你好", nextId: 1, callback: function (tile, logic) { } }]
  },
  {
    id: 1, title: "", content: "上次我的水獭在我不在家的时候居然把我围巾撕烂了，郁闷。",
    options: [{ text: "哦哦", nextId: 0, callback: function (tile, logic) { } }
      , { text: "我还以为它把你吃了诶", nextId: 2, callback: function (tile, logic) { } }]
  },
  {
    id: 2, title: "", content: "哈哈，你真会说笑",
    options: [{ text: "哈哈，我随便看看", nextId: 0, callback: function (tile, logic) { } }
      , { text: "哈哈，再见", nextId: -1, callback: function (tile, logic) { } }]
  },
]
//当前场景id
var currentSceneId = 0;
var dialogueList = [{ id: 0, title: "", content: "", options: [{ text: "确定", nextId: -1 }, { text: "取消", nextId: -1 }] }];
var logic;
var tile;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ""
    },
    content: {
      type: String,
      value: ""
    },
    options: {
      type: Array,
      value: [{ text: "确定", nextId: -1 }, { text: "取消", nextId: -1}]
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    isHidden: true,
  },
  attached:function(){
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //隐藏弹框
    hide: function () {
      this.setData({
        isHidden: true
      })
    },
    //展示弹框
    show: function (t, l, talkType) {
      logic = l;
      tile = t;
      this.setData({
        isHidden: false
      })
      this.setDialogue(talkType);
    },
    /**设置对话 */
    setDialogue:function(talkType){
      switch(talkType){
        case 0: dialogueList = toBattle;break;
        case 1: dialogueList = toBattle1; break;
        case 2: dialogueList = toStoreQuest; break;
        case 3: dialogueList = toStoreQuest1; break;
        case 4: dialogueList = toStoreQuest2; break;
        case 5: dialogueList = toStoreQuest3; break;
      }
      
        this.loadDialogue(0);
      
    },
    loadDialogue:function(id){
      if(id == -1){
        this.hide();
        return;
      }
      for (var i = 0; i < dialogueList.length;i++){
        var d = dialogueList[i];
        if(d.id == id){
          currentSceneId = id;
          var title = tile.text;
          if (d.title !== null || d.title !== undefined || d.title !== '') {
            title = d.title;
          } 
          this.setData({
            title: title,
            content:d.content,
            options: d.options,
          });
          break;
        }
      }
    },
    buttonTap: function (event) {
      var i = event.currentTarget.dataset.index;
      this.triggerEvent("buttonTap", { index: i });
      var op = dialogueList[currentSceneId].options[i];
      
      if (op.callback){
        op.callback(tile,logic);
      }
      this.loadDialogue(dialogueList[currentSceneId].options[i].nextId);
    }
  }
})
