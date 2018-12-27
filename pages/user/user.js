//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      wx.setStorage({
        key: "userInfo",
        data: app.globalData.userInfo,
      })
      if (!wx.getStorageSync('phoneObj')) {
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }

    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.setStorage({
          key: "userInfo",
          data: res.userInfo,
        })

      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          wx.setStorage({
            key: "userInfo",
            data: res.userInfo,
          })
         
        }
      })
    }
  },
  onShow: function () {
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
        hasUserInfo: true
      })
      if (!wx.getStorageSync('phoneObj')){
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }
    }else{
      this.setData({
        hasUserInfo: false
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    if (e.detail.userInfo){
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      wx.setStorage({
        key: "userInfo",
        data: e.detail.userInfo,
      })
      if (app.globalData.userInfo) {
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }
    } else {
      this.setData({
        hasUserInfo: false
      })
    }
    
  }
})
