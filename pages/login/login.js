//获取应用实例
const app = getApp()
Page({
  data: {
  },
  //事件处理函数
  
  onLoad: function (options) {
    
  },
  getPhoneNumber: function (e) {
    if (e.detail.iv){
      let ivObj = e.detail.iv
      let telObj = e.detail.encryptedData
      let codeObj = "";
      let that = this;
      //------执行Login
      wx.login({
        success: res => {
          wx.request({
            url: app.globalData.apiUrl + '/api/v2/getWxPhone/getphone.php',
            data: {
              appid: "wx6db7498d371fb240",
              secret: "bb447cb4d295b74835f02336d8a85821",
              code: res.code,
              encryptedData: telObj,
              iv: ivObj
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res)
              wx.setStorage({
                key: "phoneObj",
                data: res.data.phoneNumber,
              })
              let phone = res.data.phoneNumber
              console.log(phone)
              let userInfo = wx.getStorageSync('userInfo')
              let userObj = {
                "username": res.data.phoneNumber,
                "userInfo": userInfo
              }
              //提交用户到数据库weixin_user
              wx.request({
                url: app.globalData.apiUrl + '/api/v2/weixin/addWxUser.php',
                method: 'POST',
                data: JSON.stringify(userObj),
                header: { 'content-type': 'application/json' },
                success(userdata) {
                  if (userdata.data.code == 200) {
                    console.log(userdata.data.code)
                    if (wx.getStorageSync('backurl')){
                      wx.navigateTo({
                        url: wx.getStorageSync('backurl')
                      })
                    }else{
                      wx.navigateBack({
                        delta: 2
                      })
                    }
                    
                  } else {

                  }
                }
              })
            }
          })
        }
      });

      //---------登录有效期检查
      wx.checkSession({
        success: function () {
          //session_key 未过期，并且在本生命周期一直有效
        },
        fail: function () {
          // session_key 已经失效，需要重新执行登录流程
          wx.login() //重新登录
        }
      });
    }else{
      
    }
    
  }
})
