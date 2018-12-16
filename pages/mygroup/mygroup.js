//index.js
//获取应用实例
const app = getApp()
let username = wx.getStorageSync('phoneObj')
Page({
  data: {
    joinList: [],
    buildList: [],
    noJoinList: false,
    noBuildList: false
  },
  //事件处理函数
  
  onLoad: function () {
    this.getJoinList();
    this.getBuildList();
  },
  onShow: function () {
    if (!wx.getStorageSync('phoneObj')){
      wx.switchTab({
        url: '/pages/user/user'
      })
    }
  },
  getJoinList: function () {//我加入的圈子
    let that = this
    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/myJoinGroup.php?username=' + username,
      header: { 'content-type': 'application/json' },
      success(res) {
        if(res.data.data.length<1){
          that.setData({
            noJoinList: true
          })
        }else{
          that.setData({
            joinList: res.data.data,
            noJoinList: false
          })
        }
        
      }
    })
  },
  getBuildList: function (catid) {//创建的圈子
    catid = catid ? catid : "4144";
    let that = this;
    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/myBuildGroup.php?username=' + username,
      header: { 'content-type': 'application/json' },
      success(res) {
        if(res.data.data.length<1){
          that.setData({
            noBuildList: true
          })
        }else{
          that.setData({
            buildList: res.data.data,
            noBuildList: false
          })
        }
      }
    })
  }
    
})
