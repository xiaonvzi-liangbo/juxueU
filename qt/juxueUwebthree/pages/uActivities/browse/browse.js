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
    pageNum: 1,
    collageName: "",
    eventContent:[]
  },
  //获取浏览活动
  history() {
    let that = this
    wx.request({
      url: requestUrl.requestUrl + '/jxActivityMainApp/findByHotActivity',
      method: 'get',
      data: {
        pageNum: that.data.pageNum,
        pageSize: 10
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (that.data.pageNum=='1'){
          that.setData({
            eventContent: res.data.rows
          })
        } else {
          that.setData({
            eventContent: that.data.eventContent.concat(res.data.rows)
          })
        }
     
      }

    })
  },
 
  onLoad: function (options) {
    this.history()
  },
  /*** 页面上拉触底事件的处理函数 */
  onReachBottom: function () {
    if (this.data.eventContent.length == 10) {
      this.data.pageNum++
      this.history()}
  },
})
