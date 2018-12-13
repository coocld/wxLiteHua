//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {}
  },
  //事件处理函数
  
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }  else {
      wx.navigateTo({
        url: '/pages/auth/auth'
      })
    }
  }
})
