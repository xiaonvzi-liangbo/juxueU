import requestUrl from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    but: true,
    button: false,
    userinfo: '',
    phone:'',
    user:""
  },
  //点击授权
  getUserInfo(e) {
    let that = this;
    let session = wx.getStorageSync('sessionKey');
    wx.getUserInfo({
      success(res) {
        wx.request({
          url: requestUrl.requestUrl + '/jj/weChat/jm',
          method: 'POST',
          data: {
            encryptedData: res.encryptedData,
            errMsg: session,
            iv: res.iv
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          success(res) {
            that.setData({
              userinfo: e.detail.userInfo,
              but: false,
              button: true
            })
            wx.setStorageSync('uid', res.data.unionId)
            wx.setStorageSync('phone', '');
            wx.setStorageSync('quanxian', res.data.openId);
            wx.setStorageSync('openid', res.data.openId);
            wx.setStorageSync('nickName', that.data.userinfo.nickName);
            wx.setStorageSync('logo', that.data.userinfo.avatarUrl);
            wx.setStorageSync('country', that.data.userinfo.country);
            wx.setStorageSync('province', that.data.userinfo.province);
            wx.setStorageSync('city', that.data.userinfo.city);

            wx.request({
              url: requestUrl.requestUrl + '/jXUserApp/authorization',
              method: 'post',
              data: {
                openId: res.data.openId,
                nickName: that.data.userinfo.nickName,
                logo: that.data.userinfo.avatarUrl,
                country: that.data.userinfo.country,
                province: that.data.userinfo.province,
                city: that.data.userinfo.city
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
              },
              success(r) {
                wx.showTabBar()
                if (r.data.code == '200') {
                  wx.setStorageSync('userid', r.data.data.id);
                  wx.setStorageSync('phone', r.data.data.phone)
                  let pages = getCurrentPages();
                  that.getMy(); //异步同步
                  that.accredit()

                } else {
                  wx.showToast({
                    title: '授权失败，请重试！',
                    icon: 'none',
                    duration: 2000
                  })
                }
              }
            })
          }
        })
      },
      fail() {
        wx.showToast({
          title: '登录已拒绝！',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //手机号授权
  phonenumber(e) {
    let that = this;
    let openid = wx.getStorageSync('openid');
    let session = wx.getStorageSync('sessionKey');
    wx.request({
      url: requestUrl.requestUrl + '/jj/weChat/jm',
      method: 'POST',
      data: {
        encryptedData: e.detail.encryptedData,
        errMsg: session,
        iv: e.detail.iv
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      success(res) {
         
      }
    })
  },
  accredit() {
    let that = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          setTimeout(res => {
            wx.navigateTo({
              url: '/pages/prospects/Jobanalysis/Jobanalysis?user ='+that.data.user 
            })
          }, 2000)
        } else {
          that.setData({
            button: true
          })
        } 
      }
    })
  },
  onLoad(options) {
    this.setData({
      user: options.user,
    })
    this.accredit()
  },
})