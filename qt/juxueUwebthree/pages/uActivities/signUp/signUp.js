// pages/components/uActivities/hotact/hotact.js
const requestUrl = require('../../../utils/request.js')
const number = require('../../../utils/quantity.js')
const time = require('../../../utils/time.js')
Page({

  /**
   * 组件的初始数据
   */
  data: {
    information: [], 
    collageName: "",
    eventContent:[]
  },

  //获取报名活动
  getcollect() {
    let that = this
    let userid = wx.getStorageSync('userid')
    wx.request({
      url: requestUrl.requestUrl + '/jxActivityMainApp/finByActivityId',
      method: 'get',
      data: { 
        userId: userid
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (that.data.pageNum == '1') {
          that.setData({
            eventContent: res.data.data
          })
        } else {
          that.setData({
            eventContent: that.data.eventContent.concat(res.data.data)
          })
        }
      }

    })
  },
  onLoad: function (options) {
    this.getcollect()
  },

  /*** 页面上拉触底事件的处理函数 */
  onReachBottom: function () {
    // if (this.data.eventContent.length == 10) {
      this.data.pageNum++
    this.getcollect()
    // }
  },
})
