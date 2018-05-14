/**
 * 关卡事件
 * 
 */
var Event = function(){
  var that = this;
  var init = function () {
    console.log("init");
  }
  that.doSth = function () {};
  init();
  return that;
}
module.exports = {
  Event, Event
}