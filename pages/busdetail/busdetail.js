//获取应用实例
const app = getApp()

Page({
  data: {
    userid: '',
    detail: '',
    content: '',
    company:''
  },
  onLoad: function (options) {
    this.setData({
      userid: options.userid
    })
    this.getDetail()
  },
  getDetail: function(){
    let that = this
    let data = {
      userid: this.data.userid
    }
    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/busDetail.php',
      method: 'GET',
      data: data,
      header: { 'content-type': 'application/json' },
      success(res) {
        that.setData({
          detail: res.data.data,
          company: res.data.data.company,
          content: res.data.data.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ')
        })
      }
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: '花生圈-' + this.data.company,
      path: '/pages/busdetail/busdetail?userid=' + this.data.userid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  goHome: function(){
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})
