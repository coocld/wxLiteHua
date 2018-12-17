//index.js
//获取应用实例
const app = getApp()
let offset = 0
let pagesize = 20

Page({
  data: {
    imgUrls: [],
    iconsList:[],
    topList:[],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    moreText: '加载更多...',
    total: 0,
    clientHeight:'',
    hasMore: true
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
    this.getSlide()
    this.getIcons()
    offset = 0
    this.getToplist(offset)
  },
  getSlide: function () {//轮播
    let that = this
    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/homeSlide.php',
      header: {'content-type': 'application/json'},
      success(res) {
        that.setData({
          imgUrls: res.data.data
        })
      }
    })
  },
  getIcons: function () {//icons
    let that = this
    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/homeClubGroup.php',
      header: { 'content-type': 'application/json' },
      success(res) {
        that.setData({
          iconsList: res.data.data
        })
      }
    })
  },
  getToplist: function (offset) {//toplist
    let that = this
    let data = {
      offset: offset,
      pagesize: pagesize
    }
    data = JSON.stringify(data)
    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/homeTopList.php',
      method: 'POST',
      data: data,
      header: { 'content-type': 'application/json' },
      success(res) {
        that.setData({
          topList: res.data.data,
          total: res.data.pages.total
        })
      }
    })
  },
  getMoreToplist: function (offset) {//moretoplist
    let that = this
    let data = {
      offset: offset,
      pagesize: pagesize
    }
    data = JSON.stringify(data)
    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/homeTopList.php',
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
