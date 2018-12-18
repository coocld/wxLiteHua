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
    clientHeight: '',
    isJoin: true
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
    this.selectJoin();
  },
  getGroupDetail: function () {
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
        if(res.data.data.length<1){
          that.setData({
            moreText: "暂无内容"
          })
        } else if (res.data.data.length < 3){
          that.setData({
            moreText: "无更多数据",
            groupCardList: res.data.data,
            total: res.data.pages.total
          })
        }else{
          that.setData({
            groupCardList: res.data.data,
            total: res.data.pages.total
          })
        }
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
  },
  selectJoin: function () {
    let that =this;
    let data = {
      gid: this.data.gid,
      username: wx.getStorageSync('phoneObj')
    }
    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/selectGroup.php',
      header: { 'content-type': 'application/json' },
      method: 'POST',
      data: JSON.stringify(data),
      success(res) {
        if(res.data.code == '200'){
          that.setData({
            isJoin: true
          })
        }else{
          that.setData({
            isJoin: false
          })
        }
      }
    })
  },
  joinGroup: function (e) {
    let that = this;
    if (!wx.getStorageSync('phoneObj')) {
      wx.switchTab({
        url: '/pages/user/user'
      })
      return false;
    }
    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/joinGroup.php',
      header: { 'content-type': 'application/json' },
      method: 'POST',
      data: {
        "gid": this.data.gid,
        "username": wx.getStorageSync('phoneObj'),
        "passport": wx.getStorageSync('userInfo').nickName,
        "status": 3
      },
      success(res) {
        if (res.data.code == '200') {
          wx.showToast({
            "title": "加入成功",
            "icon": "success"
          })
          that.setData({
            isJoin: true
          })
        } else if (res.data.code == '300') {
          wx.showToast({
            "title": "你已加入",
            "icon": "success"
          })
          that.setData({
            isJoin: true
          })
        } else {
          wx.showToast({
            "title": "加入失败",
            "icon": "success"
          })
        }
      }
    })
  },
  outGroup: function (e) {
    let that = this;
    if (!wx.getStorageSync('phoneObj')) {
      wx.switchTab({
        url: '/pages/user/user'
      })
      return false;
    }
    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/outGroup.php',
      header: { 'content-type': 'application/json' },
      method: 'POST',
      data: {
        "gid": this.data.gid,
        "username": wx.getStorageSync('phoneObj')
      },
      success(res) {
        if (res.data.code == '200') {
          wx.showToast({
            "title": "退出成功",
            "icon": "success"
          })
          that.setData({
            isJoin: false
          })
        } else {
          wx.showToast({
            "title": "退出失败",
            "icon": "success"
          })
        }
      }
    })
  }
    
})
