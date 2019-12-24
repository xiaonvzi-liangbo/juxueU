import requestUrl from '../../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    approve: [],
    reveal: false
  },
  //个人认证点击事件
  self() {
    wx.navigateTo({
      url: '/pages/my/grApprove/grApprove',
    })
  },
  //获取认证列表
  getList() {
    let that = this;
    let userid = wx.getStorageSync('userid');
    wx.request({
      url: requestUrl.requestUrl + '/jXAssociationApp/findByUserId',
      method: 'get',
      data: {
        userId: userid
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        for (let i = 0; i < res.data.rows; i++) {
          if (res.data.rows[i].associationType == '1') {
            that.setData({
              reveal: true
            })
          }
        };
        that.setData({
          approve: res.data.rows
        })
      }
    })
  },
  //社团认证
  stApprove() {
    let renzheng = wx.getStorageSync('renzheng')
    if (!renzheng) {
      reminder = "尚未认证，请先去认证个人信息！"
    } else {
      wx.navigateTo({
        url: '/pages/my/stApprove/stApprove'
      })
    }
  },
  onLoad() {
    this.getList()
  }
})