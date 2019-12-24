const requestUrl = require('../../../utils/request.js')
Page({


  data: {
    details: [],
    follow: '1',
    id: '',
    pageNum: '1'
  },
  /*** 生命周期函数--监听页面加载*/
  onLoad: function(options) {
    this.setData({
      id: options.activityId
    })
    this.getFocus()
    this.getagree()
  },
  //获取申请用户
  getFocus() {
    let that = this;
    let userid = wx.getStorageSync('userid');
    wx.request({
      url: requestUrl.requestUrl + '/jxActivityMainApp/finByActivity',
      method: 'get',
      data: {
        pageNum: that.data.pageNum,
        pageSize: '10',
        activityId: that.data.id,
        peopleState: '1'
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (that.data.pageNum == '1') {
          that.setData({
            details: res.data.data.rows
          })
        } else {
          that.setData({
            details: that.data.details.concat(res.data.data.rows)
          })
        }
      }
    })
  },

  //报名用户详情
  personage(e) {
    wx.navigateTo({
      url: '/pages/universityCircle/myPost/myPost?id=' + e.currentTarget.dataset.id,
    })
  },
  //同意报名用户
  ok(e) {
    let that = this
    wx.request({
      url: requestUrl.requestUrl + '/jxActivityMainApp/updateActivityMainPeople',
      data: {
        id: e.currentTarget.dataset.id,
        isSuccess: "2"
      },
      method: "post",
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '已同意用户申请',
            icon: "none"
          })
        } else {
          if (res.data.code == 200) {
            wx.showToast({
              title: '请稍后重试！',
              icon: "none"
            })
          }
        }
        that.getFocus()
        that.getagree()
      }
    })
  },
  //拒绝报名用户
  refuse(e) {
    let that = this
    wx.request({
      url: requestUrl.requestUrl + '',
      data: {
        id: e.currentTarget.dataset.id,
        isSuccess: "3"
      },
      method: "post",
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '已拒绝用户申请',
            icon: "none"
          })
        } else {
          if (res.data.code == 200) {
            wx.showToast({
              title: '请稍后重试！',
              icon: "none"
            })
          }
        }
        that.getFocus()
        that.getagree()
      }
    })
  },
  tower() {
    this.pageNum++
      this.getFocus()
  }

})