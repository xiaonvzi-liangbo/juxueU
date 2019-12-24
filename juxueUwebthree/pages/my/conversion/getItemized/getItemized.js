// pages/my/record/record.js
import requestUrl from '../../../../utils/request.js'
Page({

  /*** 页面的初始数据 */
  data: {
    mingxi:[],
    pageNum:'1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getmingxi()
  },
  getmingxi() {
    let that = this
    let userid = wx.getStorageSync('userid');
    wx.request({
      url: requestUrl.requestUrl + '/jXUserApp/findByIntegralDetailed',
      method: 'get',
      data: {
        pageNum: that.data.pageNum,
        pageSize: '10',
        userId: userid
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (that.data.pageNum=='1') {
          that.setData({
            mingxi: res.data.data.rows
          })}else{
        that.setData({
          mingxi: that.data.mingxi.concat(res.data.data.rows)
        })
      }
        console.log(that.data.mingxi)
      }
    })
  },
  //上拉加载
  tolower() {
    this.data.pageNum++;
    this.getmingxi()
  }
})