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
    catid = catid ? catid : "4144";
    let that = this;
    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/groupAll.php?catid=' + catid,
      header: { 'content-type': 'application/json' },
      success(res) {
        that.setData({
          groupList: res.data.data
        })
      }
    })
  },
  loadMore: function () {
    console.log("加载更多。。。")
  }
    
})
