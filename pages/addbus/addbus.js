var app = getApp()
var list = []
Page({
  data: {
    busThumbUrl: 'https://www.cnnma.com/api/v2/club/upload/commdefalut.jpg', //公司头像
    content: '',
    imgIndex: 0,
    imageLength: 0,
    firstCon: '',
    dataList: [],
    truename: '',  //真实姓名
    gender: 1,
    gendername: '男',
    company: '',
    busyear: '',  //成立年
    typeList: ['企业单位', '个体经营'],
    genderList: ['男', '女'],
    type: '企业单位',
    career:'总经理',
    city: [],
    business: '',
    wechat: '',
    telephone: '',
    qq: '',
    address: ''
  },
  onLoad: function (options) {
    this.setData({
      telephone: wx.getStorageSync('phoneObj')
    })
  },
  onShow: function (e) {
    // this.selectBusInfo()
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
                  url: app.globalData.apiUrl + '/api/v2/club/uploadphoto.php',
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
  postbus: function(){
    if (this.data.busThumbUrl == "https://www.cnnma.com/api/v2/club/upload/commdefalut.jpg") {
      wx.showModal({
        content: '请上传企业形象图',
        showCancel: false, //不显示取消按钮
        confirmText: '确定'
      })
      return false;
    } 
    if (this.data.company == "") {
      wx.showModal({
        content: '请填写公司名称',
        showCancel: false, //不显示取消按钮
        confirmText: '确定'
      })
      return false;
    } 
    
    if (this.data.busyear == "") {
      wx.showModal({
        content: '请选择公司成立年份',
        showCancel: false, //不显示取消按钮
        confirmText: '确定'
      })
      return false;
    }
    if (this.data.city == "") {
      wx.showModal({
        content: '请选择经营产区',
        showCancel: false, //不显示取消按钮
        confirmText: '确定'
      })
      return false;
    }
    if (this.data.business == "") {
      wx.showModal({
        content: '请填写主营业务',
        showCancel: false, //不显示取消按钮
        confirmText: '确定'
      })
      return false;
    }
    if (this.data.truename == "") {
      wx.showModal({
        content: '请填写真实姓名',
        showCancel: false, //不显示取消按钮
        confirmText: '确定'
      })
      return false;
    }

    if (this.data.career == "") {
      wx.showModal({
        content: '请填写公司职务',
        showCancel: false, //不显示取消按钮
        confirmText: '确定'
      })
      return false;
    } 
    if (this.data.wechat == "") {
      wx.showModal({
        content: '请填写微信',
        showCancel: false, //不显示取消按钮
        confirmText: '确定'
      })
      return false;
    }
    if (this.data.address == "") {
      wx.showModal({
        content: '请填写详细地址',
        showCancel: false, //不显示取消按钮
        confirmText: '确定'
      })
      return false;
    }
    if (this.data.firstCon.length < 5) {
      wx.showModal({
        content: '公司简介，不少于五个字',
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
      username: wx.getStorageSync('phoneObj'),
      passport: wx.getStorageSync('userInfo').nickName,
      busThumbUrl: this.data.busThumbUrl,
      content: content,
      truename: this.data.truename, //真实姓名
      company: this.data.company,
      busyear: this.data.busyear,
      type: this.data.type,
      city: this.data.city[0] + "-" + this.data.city[1] + "-" + this.data.city[2],
      business: this.data.business,
      wechat: this.data.wechat,
      telephone: this.data.telephone,
      qq: this.data.qq,
      address: this.data.address,
      gender: this.data.gender,
      career: this.data.career
    }

    wx.request({
      url: app.globalData.apiUrl + '/api/v2/club/addBus.php',
      data: JSON.stringify(data),
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == '200'){
          wx.showToast({
            "title": "发布成功，等待审核",
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
  },
  addThumb: function () {
    var that = this;
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
                url: app.globalData.apiUrl + '/api/v2/club/uploadphoto.php',
                filePath: res.tempFilePaths[0],
                name: 'uploaderInput',
                success: function (updata) {
                  that.setData({
                    busThumbUrl: JSON.parse(updata.data).url,
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
  },
  bindYeaChange: function(e){
    this.setData({
      busyear: e.detail.value
    })
  },
  bindTypeChange: function(e){
    this.setData({
      type: this.data.typeList[e.detail.value]
    })
  },
  bindGenderChange: function (e) {
    this.setData({
      gender: parseInt(parseInt(e.detail.value)+1),
      gendername: this.data.genderList[e.detail.value]
    })
    console.log(this.data.gender)
  },
  bindCityChang(e) {
    this.setData({
      city: e.detail.value
    })
  },
  bindtruename(e){
    this.setData({
      truename: e.detail.value
    })
  },
  bindbusiness(e){
    this.setData({
      business: e.detail.value
    })
  },
  bindwechat(e) {
    this.setData({
      wechat: e.detail.value
    })
  },
  bindtelephone(e) {
    this.setData({
      telephone: e.detail.value
    })
  },
  bindqq(e) {
    this.setData({
      qq: e.detail.value
    })
  },
  bindaddress(e) {
    this.setData({
      address: e.detail.value
    })
  },
  bindcompany(e) {
    this.setData({
      company: e.detail.value
    })
  },
  bindcareer(e) {
    this.setData({
      career: e.detail.value
    })
  },
  selectBusInfo(){
    let that =this
    if (wx.getStorageSync('phoneObj')) {
      wx.request({
        url: app.globalData.apiUrl + '/api/v2/club/selectBus.php?username=' + wx.getStorageSync('phoneObj'),
        method: 'GET',
        header: { 'content-type': 'application/json' },
        success(res) {
          if (res.data.code = "200") {
            let citystr = res.data.data.regcity
            console.log(citystr)
           that.setData({
             busThumbUrl: res.data.data.thumb,
             truename: res.data.data.truename, //真实姓名
             company: res.data.data.company,
             busyear: res.data.data.regyear,
             type: res.data.data.type,
             city: res.data.data.regcity.split('-'),
             business: res.data.data.business,
             wechat: res.data.data.wechat,
             telephone: res.data.data.mobile,
             qq: res.data.data.qq,
             address: res.data.data.address,
             gender: res.data.data.gender,
             career: res.data.data.career
           })
          }
        }
      })
    }
  }
})