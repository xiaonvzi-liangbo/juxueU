// pages/uActivities/allAcyivities/allAcyivities.js 
const requestUrl = require('../../../utils/request.js')
const number = require('../../../utils/quantity.js')
const time = require('../../../utils/time.js') 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searinput: '',
    clean: false,
    result: [],
    information: [],
    pageNum: 1,
    pages:"1",
    collageName: "",
    eventContent: []
  },

  //监听输入框输入事件
  commun(e) {
    this.setData({
      searinput: e.detail.value
    })
  },
  //搜索点击事件
  community() {
    let that = this;
    wx.request({
      url: requestUrl.requestUrl + '/jxActivityMainApp/findByLikeCollageName',
      data: {
        collageName: that.data.searinput,
        pageNum: that.data.pages,
        pageSize: 10
      },
      header: {
        'content-type': 'application/json',
        "content-type": "application/x-www-form-urlencoded"
      },
      success(res) {
        that.setData({
          result: that.data.result.concat(res.data.rows),
          clean: true
        })
      }
    })
  },
  //取消点击事件
  quxiao() {
    this.setData({
      clean: false
    })
  },
    //获取所有活动
    getcollect() {
    let that = this
    let userid = wx.getStorageSync('userid')
    wx.request({
      url: requestUrl.requestUrl + '/jxActivityMainApp/findByLikeCollageName',
      method: 'get',
      data: {
        pageNum: that.data.pageNum,
        pageSize: 10,
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (that.data.pageNum == '1') {
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
    this.getcollect()
  },

  /*** 页面上拉触底事件的处理函数 */
  onReachBottom: function () {
    if (this.data.eventContent.length == 10) {
    this.data.pageNum++
    this.getcollect()
    }
  },
 
})