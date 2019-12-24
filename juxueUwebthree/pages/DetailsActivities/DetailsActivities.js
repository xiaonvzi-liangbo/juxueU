// pages/DetailsActivities/DetailsActivities.js
const requestUrl = require('../../utils/request.js')
const time = require('../../utils/time.js')
const quantity = require('../../utils/quantity.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: [],
    transferid: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
        transferid: options.transferid,
      }),

    this.getdata()
  },

  /** * 用户点击右上角分享*/
  //分享
  onShareAppMessage: function(res) {
    if (res.from === 'image') {
      // 来自页面内转发按钮
    }
    return {
      title: "盛夏来袭，好课不停",
      path: '/pages/DetailsActivities/DetailsActivities'
    }
  },
  // 获取活动详情数据
  getdata: function() {
    var that = this;
    wx.request({
      url: requestUrl.requestUrl +'/jXCurriculumActivities/findById',
      data: {
        id: that.data.transferid
      },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        let information = res.data.data
        that.setData({
          details: that.data.details.concat(information)
        });
      }
    })
  },
})