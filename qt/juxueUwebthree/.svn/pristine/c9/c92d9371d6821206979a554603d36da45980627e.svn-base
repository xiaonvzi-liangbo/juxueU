import requestUrl from '../../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    contenr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDate(options.proid)
  },
  //获取详情
  getDate(id){
    let that=this;
    wx.request({
      url: requestUrl.requestUrl + '/promoteApp/getPromoteDetail',
      method: 'get',
      data: {
        proId: id
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == '200') {
          that.setData({
            contenr: res.data.data
          })
        }
      }
    })
  }
})