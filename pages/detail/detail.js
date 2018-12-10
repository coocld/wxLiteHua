const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    itemid: '',
    gid: '',
    detail:{},
    dataTime: '',
    replyList:[]
  },
  onLoad: function (options) {
    this.setData({
      itemid: options.itemid,
      gid: options.gid
    })
    this.getDetail()
    this.getReplyList()
  },
  getDetail: function () {//detail
  let that = this
    let data = {
      itemid: this.data.itemid,
      gid: this.data.gid
    }
    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/detail.php',
      method: 'GET',
      data: data,
      header: { 'content-type': 'application/json' },
      success(res) {
        that.setData({
          detail: res.data.data,
          dataTime: util.formatTime(res.data.data.edittime)
        })
      }
    })
  },
  getReplyList: function () {//detail
    let that = this
    let data = {
      itemid: this.data.itemid
    }
    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/replyList.php',
      method: 'GET',
      data: data,
      header: { 'content-type': 'application/json' },
      success(res) {
        console.log(res)
        that.setData({
          replyList: res.data.data
        })
      }
    })
  }
})
