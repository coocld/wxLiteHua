//获取应用实例
const app = getApp()
let offset = 0
let pagesize = 20

Page({
  data: {
    busList:[],
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
    offset = 0
    this.getToplist(offset)
  },
  getToplist: function (offset) {//toplist
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    let data = {
      offset: offset,
      pagesize: pagesize
    }
    data = JSON.stringify(data)
    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/busList.php',
      method: 'POST',
      data: data,
      header: { 'content-type': 'application/json' },
      success(res) {
        that.setData({
          busList: res.data.data,
          total: res.data.pages.total
        })
        wx.hideLoading()
      }
    })
  },
  getMoreBuslist: function (offset) {//moretoplist
    let that = this
    let data = {
      offset: offset,
      pagesize: pagesize
    }
    data = JSON.stringify(data)
    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/busList.php',
      method: 'POST',
      data: data,
      header: { 'content-type': 'application/json' },
      success(res) {
        let newsList = res.data.data
        let allList = that.data.busList
        allList = [...allList, ...newsList]
        that.setData({
          busList: allList
        })
        
      }
    })
  },
  loadMore: function () {
    if (offset < (this.data.total / pagesize - 1)){
      offset++
      this.getMoreBuslist(offset)
    }else{
      this.setData({
        moreText: '无更多数据',
        hasMore: false
      })
    }
  },
  bindAddBusCard(){
    if (!wx.getStorageSync('phoneObj')) {
      wx.setStorageSync('backurl', '/pages/addbus/addbus')
      wx.switchTab({
        url: '/pages/user/user'
      })
      return false;
    }
    wx.navigateTo({
      url: '/pages/addbus/addbus'
    })
  }
  
})
