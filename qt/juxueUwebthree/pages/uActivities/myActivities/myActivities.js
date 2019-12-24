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
    eventContent: [],
    visible: false,
  },

  /*** 生命周期函数--监听页面加载*/
  // onLoad: function(options) {},
  lication: function() {
    this.selectComponent("#mine").getMy()
    this.setData({

    })
  },
  release(){
    wx.navigateTo({
      url: '/pages/uActivities/myActivities/release/release'
    })
  },
  //获取我的活动
  getmyAct() {
    let that = this
    let userid = wx.getStorageSync('userid')
    wx.request({
      url: requestUrl.requestUrl + '/jxActivityMainApp/findByMyActivity',
      method: 'get',
      data: {
        pageNum: that.data.pageNum,
        pageSize: 10,
        createrId: userid
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
      
        that.setData({
          eventContent: res.data.rows
        })
      }

    })
  },
  onLoad: function (options) {
    this.getmyAct()
  },
  /*** 页面上拉触底事件的处理函数 */
  onReachBottom: function () {
    if (this.data.eventContent.length == 10) {
      this.data.pageNum++
      this.getmyAct()
    }
  },
})