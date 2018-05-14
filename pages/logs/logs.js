//logs.js
const util = require('../../utils/util.js')
//canvas上下文
var ctx;
var interval;
//是否执行动画
var running = false;
Page({
  data: {
    logs: []
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.width = res.windowWidth;
        that.height = res.windowHeight;
        console.log(that.width);
        console.log(that.height);
      },
    })
  },
  startDraw: function () {
    var that = this;
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(function () {
      if (!running) {
        clearInterval(interval);
        return;
      }
      that.drawCanvas(that);
    }, 10);
  },
  drawCanvas: function (that) {
    ctx = wx.createCanvasContext("battle", this);
    that.drawBackground(that);
    ctx.draw();

  },
  onHide: function () {
    running = false;
  },
  onShow: function () {
    running = true;
    this.startDraw();
  },
  drawBackground: function (that) {
    ctx.save();
    ctx.setFillStyle('gray');
    ctx.fillRect(0, 0, that.width, that.height);
    ctx.restore();
  },
  drawBullet: function (that) {
    ctx.save();
    ctx.setFillStyle('gray');
    ctx.fillRect(0, 0, that.width, that.height);
    ctx.restore();
  },
  // onLoad: function () {
  //   this.setData({
  //     logs: (wx.getStorageSync('logs') || []).map(log => {
  //       return util.formatTime(new Date(log))
  //     })
  //   })
  // }
})
