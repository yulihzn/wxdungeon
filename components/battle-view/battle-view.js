// components/battle-view/battle-view.js
const util = require('../../utils/util.js');
const EndType = { MISS: 0, NORMAL: 1, GOOD: 2, PERFECT: 3 }
//指针x轴位置
var cursorX = 0;
var cursorWidth = 10;
//指针是否返回
var cursorReverse = false;
//指针是否暂停
var pauseCursor = false;
//是否执行动画
var running = false;
//canvas上下文
var ctx;
//有效区位置
var normalRectX = 100;
//有效区长度
var normalRectWidth = 100;
var goodRectWidth = 10;
var perfectRectWidth = 5;

var interval;
var timelineWidth = 0;
var refreshTime = 5;
var timeout = 10 * 1000 / refreshTime;
var success;
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
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isHidden: true,
    scrollTop: 0,
  },
  attached: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.width = res.windowWidth;
        console.log(that.width);
      },
    })
  },
  ready: function () {


  },
  detached: function () {
    running = false;
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
    show: function (level,tile,suc) {
      success = suc;
      normalRectWidth = (10-level)*10;
      this.setData({
        isHidden: false,
        title: tile.text,
        content:tile.content,
      })
      running = true;
      pauseCursor = false;
      this.startDraw();
    },

    tapBattle: function () {
      pauseCursor = !pauseCursor;
      if (pauseCursor) {
        this.endBattle();
      }
      this.startDraw();
    },
    endBattle:function(){
      var t = this.endCursor();
      if (success){
        success(t);
      }
    },
    endCursor: function () {
      var goodRectX = normalRectX + normalRectWidth;
      var perfectRectX = normalRectX - perfectRectWidth;
      if (cursorX + cursorWidth / 2 >= normalRectX && cursorX + cursorWidth / 2 <= normalRectX + normalRectWidth) {
        console.log("normal!");
        this.setData({ content: this.data.content + "\n" + "打中了对方!", scrollTop: this.data.scrollTop + 100 });
        return EndType.NORMAL;
      }
      if (cursorX + cursorWidth / 2 >= goodRectX && cursorX + cursorWidth / 2 <= goodRectX + goodRectWidth) {
        console.log("good!");
        this.setData({ content: this.data.content + "\n" + "漂亮的一击!", scrollTop: this.data.scrollTop + 100 });
        return EndType.GOOD;
      }
      if (cursorX + cursorWidth / 2 >= perfectRectX && cursorX + cursorWidth / 2 <= perfectRectX + perfectRectWidth) {
        console.log("perfect!");
        this.setData({ content: this.data.content + "\n" + "致命一击!", scrollTop: this.data.scrollTop + 100 });
        return EndType.PERFECT;
      }
      console.log("miss!");
      this.setData({ content: this.data.content + "\n" + "丢失!", scrollTop: this.data.scrollTop + 100 });
      return EndType.MISS;
    },
    startDraw: function () {
      var that = this;
      timelineWidth = that.width;
      normalRectX = util.getRandomInt(20, that.width - normalRectWidth - 20);
      cursorX = 0;
      if (interval) {
        clearInterval(interval);
      }
      interval = setInterval(function () {
        if (!running || pauseCursor || timelineWidth <= 0) {
          clearInterval(interval);
          if (timelineWidth <= 0) {
            that.endBattle();
          }
          return;
        }
        that.drawBattle(that);
      }, refreshTime);
    },
    drawBattle: function (that) {
      ctx = wx.createCanvasContext("battle", this);
      that.drawBackground(that);
      that.drawScoreRect();
      that.drawCursor(that);
      that.drawTimeline(that);
      ctx.draw();

    },
    drawCursor: function (that) {
      var w = cursorWidth;
      if (cursorX >= that.width - w) {
        cursorReverse = true;
      }
      if (cursorX <= 0) {
        cursorReverse = false;
      }
      var dir = cursorReverse ? -1 : 1;
      if (!pauseCursor) {
        cursorX += dir * 2;
      }
      var x0 = cursorX;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x0, 0);
      ctx.lineTo(x0 + w, 0);
      ctx.lineTo(x0 + w / 2, 10)
      ctx.lineTo(x0, 0);
      ctx.setFillStyle("red");
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    },
    drawBackground: function (that) {
      ctx.save();
      ctx.setFillStyle('gray');
      ctx.fillRect(0, 0, that.width, 50);
      ctx.restore();
    },
    drawTimeline: function (that) {
      timelineWidth -= that.width / timeout;
      ctx.save();
      ctx.setFillStyle('greenyellow');
      ctx.fillRect(0, 50, timelineWidth, 3);
      ctx.restore();
    },
    drawScoreRect: function () {
      var goodRectX = normalRectX + normalRectWidth;
      var perfectRectX = normalRectX - perfectRectWidth;
      ctx.save();
      ctx.setFillStyle('green');
      ctx.fillRect(normalRectX, 0, normalRectWidth, 50);
      ctx.setFillStyle('gold');
      ctx.fillRect(goodRectX, 0, goodRectWidth, 50);
      ctx.setFillStyle('purple');
      ctx.fillRect(perfectRectX, 0, perfectRectWidth, 50);
      ctx.restore();
    },
  }
})

