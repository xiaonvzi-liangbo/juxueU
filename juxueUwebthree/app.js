//app.js
import requestUrl from '/utils/request.js'
App({
  onLaunch: function () { 

    wx.login({
      success: res => {
        if (res.code) {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: requestUrl.requestUrl + '/jj/weChat/getOpenId',
            method: 'get',
            data: {
              jsCode: res.code,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
            },
            success(res) { 
              wx.setStorageSync('openid', res.data.data.openid)
              wx.setStorageSync('sessionKey', res.data.data.sessionKey)
            },

          })
        }
      }
    })

    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: res => {
        let statusBarHeight = res.statusBarHeight,
          navTop = menuButtonObject.top, //胶囊按钮与顶部的距离
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2; //导航高度
        this.globalData.navHeight = navHeight;
        this.globalData.navTop = navTop;
        this.globalData.line = menuButtonObject.height;
        this.globalData.top = navTop - statusBarHeight
      }, 
    })
  },
  globalData: {
    userInfo: null,
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    navHeight: '',
    navTop: '',
    line:'',
    top:''
  },
})