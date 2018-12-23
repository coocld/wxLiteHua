//index.js
//获取应用实例
const app = getApp()
let offset = 0
let pagesize = 20

Page({
  data: {
    topList:[],
    moreText: '加载更多...',
    total: 0,
    clientHeight:'',
    hasMore: true,
    userAvatarUrl:''
  },
  onLoad: function () {
    let that =this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
    offset = 0
    this.getToplist(offset)
    this.setData({
      userAvatarUrl: wx.getStorageSync('userInfo').avatarUrl
    })
  },
  getToplist: function (offset) {//toplist
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    let data = {
      offset: offset,
      pagesize: pagesize,
      username: wx.getStorageSync('phoneObj')
    }
    data = JSON.stringify(data)
    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/myReplyList.php',
      method: 'POST',
      data: data,
      header: { 'content-type': 'application/json' },
      success(res) {
        that.setData({
          topList: res.data.data,
          total: res.data.pages.total
        })
        wx.hideLoading()
      }
    })
  },
  getMoreToplist: function (offset) {//moretoplist
    let that = this
    let data = {
      offset: offset,
      pagesize: pagesize,
      username: wx.getStorageSync('phoneObj')
    }
    data = JSON.stringify(data)
    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/myReplyList.php',
      method: 'POST',
      data: data,
      header: { 'content-type': 'application/json' },
      success(res) {
        let newsList = res.data.data
        let allList = that.data.topList
        allList = [...allList, ...newsList]
        that.setData({
          topList: allList
        })
        
      }
    })
  },
  loadMore: function () {
    if (offset < (this.data.total / pagesize - 1)){
      offset++
      this.getMoreToplist(offset)
      
    }else{
      this.setData({
        moreText: '无更多数据',
        hasMore: false
      })
    }
  }
  
})
