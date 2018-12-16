//index.js
//获取应用实例
const app = getApp()
let offset = 0
let pagesize = 20
Page({
  data: {
    groupDetail: {},
    groupCardList: [],
    gid: '',
    moreText: '加载更多...',
    total: 0,
    clientHeight: ''
  },
  //事件处理函数
  
  onLoad: function (options) {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
    this.setData({
      gid: options.gid
    });
    this.getGroupDetail();
    this.getCardList(offset);
  },
  getGroupDetail: function () {//获取圈子分类
    let that = this
    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/groupDetail.php?itemid='+this.data.gid,
      header: { 'content-type': 'application/json' },
      success(res) {
        that.setData({
          groupDetail: res.data.data
        })
      }
    })
  },
  getCardList: function (offset) {
    let that = this
    let data = {
      offset: offset,
      pagesize: pagesize
    }
    data = JSON.stringify(data)
    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/groupCardList.php?gid=' + this.data.gid,
      method: 'POST',
      data: data,
      header: { 'content-type': 'application/json' },
      success(res) {
        that.setData({
          groupCardList: res.data.data,
          total: res.data.pages.total
        })
      }
    })
  },
  getMoreCardList: function (offset) {
    let that = this
    let data = {
      offset: offset,
      pagesize: pagesize
    }
    data = JSON.stringify(data)
    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/groupCardList.php?gid=' + this.data.gid,
      method: 'POST',
      data: data,
      header: { 'content-type': 'application/json' },
      success(res) {
        let newsList = res.data.data
        let allList = that.data.groupCardList
        allList = [...allList, ...newsList]
        that.setData({
          groupCardList: allList
        })

      }
    })
  },
  loadMore: function () {
    if (offset < (this.data.total / pagesize - 1)) {
      offset++
      this.getMoreCardList(offset)

    } else {
      this.setData({
        moreText: '无更多数据',
      })
    }
  }
    
})
