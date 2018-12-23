var Utils = require('../../utils/util.js')
var app = getApp()
var list = []
Page({
  data: {
    title: '',
    content: '',
    height: 500,
    width: 320,
    imgIndex: 0,
    imageLength: 0,
    firstCon: '',
    dataList: [],
    catid: 0,
    gid:0
  },
  onLoad: function (options) {
    this.setData({
      gid: options.gid,
      catid: options.catid
    });
  },
  onShow: function (e) {
    var that = this;
    //动态获取屏幕尺寸
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight,
          width: res.windowWidth,
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  inputTitle: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  /**
   * 输入监听
   */
  inputCon: function (e) {
    let that = this;
    if (0 === e.currentTarget.id - 0) {//第一个文本框的输入监听
      that.data.firstCon = e.detail.value;
    } else {
      that.data.dataList[e.currentTarget.id - 1].value = e.detail.value;
    }
  },
  /**
   * 失去焦点监听
   * 根据失去监听的input的位置来判断图片的插入位置
   */
  outBlur: function (e) {
    let that = this;
    that.data.imgIndex = e.currentTarget.id - 0;
  },
  /**
   * 添加图片
   */
  addImg: function () {
    var that = this;
    //这里考虑到性能，对于图片张数做了限制
    if (that.data.dataList.length >= 4) {//超过四张
      wx.showModal({
        title: '提示',
        content: '最多只能添加四张图片哦',
        confirmText: "我知道了",
        confirmColor: "#00923f",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          } else if (res.cancel) {
          }
        }
      })
    } else {//添加图片
      wx.showActionSheet({
        itemList: ['从相册选择', '拍照'],
        itemColor: '#00923f',
        success: function (res) {
          var choseType = res.tapIndex == 0 ? "album" : res.tapIndex == 1 ? "camera" : "";
          if (choseType != "") {
            wx.chooseImage({
              sizeType: ['original'],//原图
              sourceType: [choseType],
              count: 1,//每次添加一张
              success: function (res) {
                wx.showLoading({
                  title: '图片上传中',
                })
                wx.uploadFile({
                  url: app.globalData.apiUrl + '/api/v2/club/uploadphoto.php', // 仅为示例，非真实的接口地址
                  filePath: res.tempFilePaths[0],
                  name: 'uploaderInput',
                  success: function(updata) {
                    // console.log(JSON.parse(updata.data).url)
                    var info = {
                      pic: JSON.parse(updata.data).url,
                      value: '',
                    }
                    that.data.dataList.push(info);//方法自行百度
                    that.setData({
                      dataList: that.data.dataList,
                    })
                    wx.hideLoading()
                  }
                })
              }
            })
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    }
  },
  /**
   * 删除图片
   */
  deletedImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    wx.showActionSheet({
      itemList: ['删除图片'],
      success: function (res) {
        if (res.tapIndex === 0) {//点击删除图片
          if (index === 0 && that.data.dataList[index].value != null) {//删除第一张，要与最上方的textarea合并
            that.data.firstCon = that.data.firstCon + that.data.dataList[index].value;
          } else if (index > 0 && that.data.dataList[index].value != null) {
            that.data.dataList[index - 1].value = that.data.dataList[index - 1].value + that.data.dataList[index].value;
          }
          that.data.dataList.splice(index, 1);
          that.setData({
            firstCon: that.data.firstCon,
            dataList: that.data.dataList
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  //失败警告
  do_fail: function (a) {
    wx.showToast({
      title: a,
      icon: 'none',
      duration: 1000
    })
  },
  postCard: function(){
    let pages = getCurrentPages();
    let currPage = null; //当前页面
    let prevPage = null; //上一个页面

    if (pages.length >= 2) {
      currPage = pages[pages.length - 1]; //当前页面
      prevPage = pages[pages.length - 2]; //上一个页面
    }
    if (prevPage) {
      prevPage.setData({
        isPageBack: true
      });
    }
    if (!wx.getStorageSync('phoneObj')) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return false;
    }
    if (this.data.title.length<1){
      wx.showModal({
        content: '标题必填',
        showCancel: false, //不显示取消按钮
        confirmText: '确定'
      })
      return false;
    }
    if (this.data.firstCon.length<5) {
      wx.showModal({
        content: '内容必填，不少于五个字',
        showCancel: false, //不显示取消按钮
        confirmText: '确定'
      })
      return false;
    }
    let content = '<div>' + this.data.firstCon+'</div>';
    content = this.data.firstCon.split('\n').join('<br>');
    for (let i = 0; i < this.data.dataList.length; i++){
      content += '<div><img class="rich-img" src="' + this.data.dataList[i].pic + '"/></div><p>' + this.data.dataList[i].value.split("\n").join("<br>")+'</p>'
    }
    let data = {
      catid: this.data.catid,
      gid: this.data.gid,
      username: wx.getStorageSync('phoneObj'),
      passport: wx.getStorageSync('userInfo').nickName,
      title: this.data.title,
      content: content,
      status: 3
    }

    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/addCard.php', // 仅为示例，并非真实的接口地址
      data: JSON.stringify(data),
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == '200'){
          wx.showToast({
            "title": "发帖成功",
            "icon": "success"
          })
          
          setTimeout(function () { 
            wx.navigateBack({
              delta: 1
            })
           }, 1000);
          
        }else{
          wx.showModal({
            content: '发送失败，请重试',
            showCancel: false, //不显示取消按钮
            confirmText: '确定'
          })
        }
      }
    })
  }
})