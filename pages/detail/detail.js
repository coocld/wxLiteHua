const app = getApp()
const util = require('../../utils/util.js')
let offset = 0
let pagesize = 10

Page({
  data: {
    itemid: '',
    gid: '',
    detail:{},
    dataTime: '',
    replyList:[],
    content:'',
    moreText: '加载更多',
    total: 0,
    likedNum: 0,
    clientHeight: '',
    hasMore: true,
    focus: false,
    isliked: false
  },
  // onShow: function () {
  //   offset = 0
  //   this.getReplyList()
  // },
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
      itemid: options.itemid,
      gid: options.gid
    })
    this.getDetail()
    offset = 0
    this.getReplyList()
    if (wx.getStorageSync("liked" + options.itemid)) {
      this.setData({
        isliked: true
      })
    }
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
          dataTime: util.formatTime(res.data.data.edittime),
          likedNum: res.data.data.liked
        })
      }
    })
  },
  getReplyList: function () {//detail
    let that = this
    let data = {
      offset: offset,
      pagesize: pagesize
    }
    data = JSON.stringify(data)
    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/replyList.php?itemid=' + this.data.itemid,
      method: 'POST',
      data: data,
      header: { 'content-type': 'application/json' },
      success(res) {
        if (res.data.data.length<1){
          that.setData({
            moreText: '暂无评论，赶紧抢个沙发',
            hasMore: false
          })
        }else{
          that.setData({
            replyList: res.data.data,
            total: res.data.pages.total
          })
        }
      }
    })
  },
  getMoreReplylist: function (offset) {//getMoreReplylist
    let that = this
    let data = {
      offset: offset,
      pagesize: pagesize
    }
    data = JSON.stringify(data)
    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/replyList.php?itemid=' + this.data.itemid,
      method: 'POST',
      data: data,
      header: { 'content-type': 'application/json' },
      success(res) {
        let replyList = res.data.data
        let allList = that.data.replyList
        allList = [...allList, ...replyList]
        that.setData({
          replyList: allList
        })

      }
    })
  },
  loadMore: function () {
    if (offset < (this.data.total / pagesize - 1)) {
      offset++
      this.getMoreReplylist(offset)

    } else {
      this.setData({
        moreText: '无更多评论',
        hasMore: false
      })
    }
  },
  bindTextAreaBlur(e) {
    this.setData({
      content: e.detail.value
    })
  },
  repBtnMsg: function () {
    this.upReply()
  },
  upReply: function () {//回复帖子
    if (!wx.getStorageSync('userInfo')) {
      wx.switchTab({
        url: '/pages/user/user'
      })
    } else {
      if (!wx.getStorageSync('phoneObj')) {
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }else{
        let that = this
        if (that.data.content == "" || that.data.content.length<4){
          wx.showModal({
            content: '评论内容不少于4个字',
            showCancel: false, //不显示取消按钮
            confirmText: '确定'
          })
          return false;
        }
        let data = {
          tid: this.data.itemid,
          gid: this.data.gid,
          username: wx.getStorageSync('phoneObj'),
          passport: wx.getStorageSync('userInfo').nickName,
          content: that.data.content,
          status: 3,
          addtime: Date.parse(new Date())
        }
        wx.request({
          url: app.globalData.apiUrl + '/api/v2/club/addReply.php',
          method: 'POST',
          data: JSON.stringify(data),
          header: { 'content-type': 'application/json' },
          success(res) {
            if (res.data.code == 200) {
              wx.showToast({
                "title": "回复成功",
                "icon": "success"
              })
              that.setData({
                content: ""
              })
              that.getReplyList()
            } else {
              wx.showToast({
                "title": "回复失败请重试"
              });
              that.setData({
                content: ""
              })
            }
          }
        })
      }
    }
    
  },
  isLogin: function () {
    if (!wx.getStorageSync('userInfo')){
      wx.switchTab({
        url: '/pages/user/user'
      })
    }else{
      if (!wx.getStorageSync('phoneObj')) {
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }
    }
  },
  addReplyBtn: function(){
    this.setData({
      focus: true
    })
  },
  likedBtn: function(){
    wx.showToast({
      "title": "你已点过赞咯"
    });
  },
  likeBtnMe: function(){
    let that = this
    let data = {
      "itemid": this.data.itemid
    }
    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/upLike.php',
      method: 'POST',
      data: JSON.stringify(data),
      header: { 'content-type': 'application/json' },
      success(res) {
        if (res.data.code == 200) {
          // wx.showToast({
          //   "title": "点赞成功",
          //   "icon": "success"
          // })
          that.setData({
            isliked: true,
            likedNum: parseInt(parseInt(that.data.likedNum)+1)
          })
          wx.setStorage({
            key: "liked" + that.data.itemid,
            data: true,
          })
        } else {
          wx.showToast({
            "title": "点赞失败"
          });
          that.setData({
            isliked: false
          })
        }
      }
    })
  }
})
