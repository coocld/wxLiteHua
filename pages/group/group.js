//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    clientHeight: '',
    onCateId: '',
    catList:[],
    groupList: []
  },
  //事件处理函数
  
  onLoad: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
    this.getCatList();
    this.getGroupList();
  },
  onGroupBtn: function(e){
    this.setData({
      onCateid: e.target.id
    })
    this.getGroupList(e.target.id);
  },
  getCatList: function () {//获取圈子分类
    let that = this
    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/cateAll.php',
      header: { 'content-type': 'application/json' },
      success(res) {
        that.setData({
          catList: res.data.data,
          onCateid: res.data.data[0].catid
        })
      }
    })
  },
  getGroupList: function (catid) {//获取圈子列表
    catid = catid ? catid : '4248';
    let that = this;
    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/groupAll.php',
      header: { 'content-type': 'application/json' },
      data: {
        "catid": catid,
        "username": wx.getStorageSync('phoneObj')
      },
      success(res) {
        app.store.setState({
          groupList: res.data.data
        });
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
    app.store.$state.groupList[e.target.dataset.index].isjoin = true
    app.store.setState({
      groupList: app.store.$state.groupList
    });
    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/joinGroup.php',
      header: { 'content-type': 'application/json' },
      method: 'POST',
      data: {
        "gid": e.target.id,
        "username": wx.getStorageSync('phoneObj'),
        "passport": wx.getStorageSync('userInfo').nickName,
        "status":3
      },
      success(res) {
        if(res.data.code == '200'){
          wx.showToast({
            "title": "加入成功",
            "icon": "success"
          })
        } else if (res.data.code == '300'){
          wx.showToast({
            "title": "你已加入",
            "icon": "success"
          })
        }else{
          wx.showToast({
            "title": "加入失败",
            "icon": "success"
          })
        }
      }
    })
  },
  loadMore: function () {
    console.log("加载更多。。。")
  }
    
})
