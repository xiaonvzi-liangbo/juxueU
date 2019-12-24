import requestUrl from '../../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    close: false,
    integral: [],
    number: '1'
  },
  //提现点击事件
  extract() {
    let that = this;
    wx.showToast({
      title: '尚未开通，敬请期待！',
      icon: 'none',
      duration: 2000
    })
   
    // that.selectComponent('#hint2').show()
  },
  //提现记录点击事件
  record() {
    wx.showToast({
      title: '尚未开通，敬请期待！',
      icon: 'none',
      duration: 2000
    })
    // wx.navigateTo({
    //   url: '/pages/my/record/record',
    // })
  },
  //提现金额选择
  money(e) {
    let that = this
    that.setData({
      number: e.currentTarget.dataset.number,
    })
  },
  //积分明细跳转
  itemized() {
    wx.navigateTo({
      url: '/pages/my/conversion/getItemized/getItemized',
    })

  },
  //提现确定点击事件
  confirm() {
    let that = this;
    that.selectComponent('#hint').show()
    that.selectComponent('#hint2').close()

  },
  //获取当前的积分
  getIntegral() {
    let that = this;
    let userid = wx.getStorageSync('userid');
    wx.request({
      url: requestUrl.requestUrl + '/jXUserApp/findByMy',
      method: 'get',
      data: {
        id: userid
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == '200') {
          res.data.data.mony = parseInt(res.data.data.integralNumber / 1000)
          that.setData({
            integral: res.data.data
          })
        }
      }
    })
  },
  onLoad(options) {
    this.getIntegral()
  }
})