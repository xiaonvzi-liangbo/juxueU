// pages/CourseActivities/CourseActivities.js
const requestUrl = require('../../utils/request.js')
const time = require('../../utils/time.js')
const quantity = require('../../utils/quantity.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: [],
    pagenum: 1,
    getphone: true
  },
  //点击跳转页面
  navpage: function(e) {
    let that = this
    let phone = wx.getStorageSync('phone')
    if (phone == 'undefined') {
      wx.navigateTo({
        url: "/pages/guidance/phone/phone"
      })
    } else {
      wx.navigateTo({
        url: '/pages/DetailsActivities/DetailsActivities?transferid=' + e.currentTarget.dataset.transferid
      })
    }
  },

  //获取课程列表数据
  getdata: function() {
    var that = this;
    wx.request({
      url: requestUrl.requestUrl + '/jXCurriculumActivities/findByAll',
      method: 'get',
      data: {
        pageNum: that.data.pagenum,
        pageSize: '10'
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'charset=UTF-8'
      },

      success(res) {
        let information = res.data.rows
        that.setData({
          details: that.data.details.concat(information)
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getdata()
  },
  //页面滑动到底部
  bindDownLoad: function() {
    that.data.pageNumber++,
      this.getdata(),
      this.getphone()
  },
  //getphone
  getphone() {
    let that = this
    let phone = wx.getStorageSync('phone')
  
    if (phone == 'undefined') {
      that.setData({
        getphone: true
      })
    } else {
      that.setData({
        getphone: false
      })
    }

  }
})