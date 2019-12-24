// pages/my/feedback/feedback.js
import requestUrl from '../../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number: 300,
    cursor: 0,
    text: '',
  },
  //监听输入字数事件
  //获取输入框内容
  expInput: function(e) {
    this.setData({
      text: e.detail.value,
      cursor: e.detail.cursor

    })
  },

  //提交数据
  postdata: function() {
    let that = this
    let userid = wx.getStorageSync('userid')
    wx: wx.request({
      url: requestUrl.requestUrl + '/jXFeedbackApp/findByAuto',
      data: {
        info: that.data.text,
        userId: userid,
      },
      header: {
        'content-type': 'application/json',
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      success: function(res) {
    if(res.data.code==200){
      wx.showToast({
        title: '反馈成功！',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        text: '',
        cursor: '0'
      })
    }
      },
    })
  }
})