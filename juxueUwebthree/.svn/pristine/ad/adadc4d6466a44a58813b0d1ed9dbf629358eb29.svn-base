// pages/my/chat/chat.js
import requestUrl from '../../../utils/request.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: true,
    details: [],
    transferid: '',
    context: '',
    access_token:''

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
        transferid: options.transferid,
      }),
      this.getdata();
    let pages = getCurrentPages();
    pages[pages.length - 1].getdata();
  },
  //获取accessToken
  accessToken(e) {
    let that = this
    let fun = e.currentTarget.dataset.fun
    wx.request({
      url: requestUrl.requestUrl + '/jj/weChat/getAccessToken',
      method: "get",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      success(res) {
        that.setData({
          access_token: res.data.data
        })
        if (fun == "send") {
          that.send()
        }
      }
    })
  },
  //h获取私信内容
  getdata: function() {
    var that = this;
    let userid = wx.getStorageSync('userid')
    wx.request({
      url: requestUrl.requestUrl + '/jXPrivateApp/findByAuto',
      data: {
        privateUserId: that.data.transferid,
        userId: userid
      },
      method: 'get',
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        let information = res.data.data
        that.setData({
          details: information,
        })
      }

    })
  },
  //监听消息输入事件
  transmit(e) {
    this.setData({
      context: e.detail.value
    })
  },
  //留言点击事件
  send() {
    let that = this;
    let userid = wx.getStorageSync('userid');
    if (!that.data.context) {
      wx.showToast({
        title: '输入的内容不能为空！',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.request({
        url: requestUrl.requestUrl + '/jXPrivateApp/add',
        method: 'post',
        data: {
          privateUserId: that.data.transferid,
          userId: userid,
          context: that.data.context,
          accessToken: that.data.access_token
        },
        header: {
          'content-type': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          if (res.data.code == '200') {
            that.getdata();
            that.setData({
              context: ''
            })
          }
        }
      })
    }
  }
})