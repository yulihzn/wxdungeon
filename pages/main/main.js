// pages/main/main.js

const app = getApp()
var logicjs = require("../main/logic.js");
var logic = logicjs.Logic();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    healthbarPercent:100,
    //最大600rpx,初始为100，中间有500的增量
    healthbarWidth:"600rpx",
    healthtext:"5/5",
    tileList: [],
    level: 1,
    playerPosition: 4,
    currItemList: [],
    currStateList:[],
    attack:0,
    money:0,
    attackextra:0,
  },
  updateUI:function(m){
    this.setData({
      tileList: m.get("tileList"),
      level: m.get("level"),
      playerPosition: m.get("playerPosition"),
      currItemList: m.get("currItemList"),
      currStateList: m.get("currStateList"),
      healthbarWidth: m.get("healthbarWidth"),
      healthbarPercent: m.get("healthbarPercent"),
      healthtext: m.get("healthtext"),
      attack: m.get("attack"),
      attackextra: m.get("attackextra"),
      expbarPercent:m.get("expbarPercent"),
      exptext:m.get("exptext"),
      explevel:m.get("explevel"),
      money:m.get("money"),
    });
  },
 
  /**
   * 点击物品查看
   */
  tapItem: function (event) {
    var i = event.currentTarget.dataset.index;
    logic.tapItem(i);
  },
  /**
   * 翻转
   */
  tileFlip: function (event) {
    var i = event.currentTarget.dataset.index;
    logic.onFlip(i);
  },
  /**打开对话框 */
  openDialog: function (tile, logic, talkType){
    this.talkdialog.show(tile,logic,talkType);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ userInfo: wx.getStorageSync("userInfo") })
    logic.reset();
    
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    this.talkdialog = this.selectComponent("#talkdialog");
    
    this.battleview = this.selectComponent("#battleview");
    // this.battleview.show(function(t){
    //   that.battleview.hide();
    //   console.log(t);
    //   that.battleview.show();
    // });
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    logic.save()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
