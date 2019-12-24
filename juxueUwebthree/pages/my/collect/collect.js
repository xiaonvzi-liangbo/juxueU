// pages/my/collect/collect.js
import requestUrl from '../../../utils/request.js'
const number = require('../../../utils/quantity.js')
const time = require('../../../utils/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    information: [],
    actions: [{
      name: '删除',
      width: 100,
      color: '#80848f'
    },],
  },
  //详情点击事件
  particulars(e) {
    wx.navigateTo({
      url: '/pages/universityCircle/information/information?tzid=' + e.currentTarget.dataset.id,
    })
  },
  //发帖人详情
  personage(e) {
    wx.navigateTo({
      url: '/pages/universityCircle/myPost/myPost?id=' + e.currentTarget.dataset.id,
    })
  },
  //获取收藏文章的数据
  getData() {
    let that = this;
    let userid = wx.getStorageSync('userid');
    wx.request({
      url: requestUrl.requestUrl + '/jXCollectionApp/findByPostsAndUserId',
      data: {
        userId: userid //用户id
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        let date = res.data.data;
        //数量,时间的处理
        for (let i = 0; i < date.length; i++) {
          date[i].visitNumber = number.number(date[i].visitNumber);
          date[i].commentNumber = number.number(date[i].commentNumber);
          date[i].createTime = time.getDateDiff(date[i].createTime);
          if (typeof (date[i].postsImg) == 'string') {
            date[i].postsImgs = date[i].postsImg.split(',')
          }
        }
        that.setData({
          information: date
        })
      
      }
    })
  },
  //删除收藏的wz
  deldata(e) {
    let that = this;
    wx.request({
      url: requestUrl.requestUrl + '/jXCollectionApp/delete',
      data: {
        id: e.currentTarget.id
      },

      method: 'get',
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == '200') {
          wx.showToast({
            title: '删除成功！',
            icon: 'none',
            duration: 2000
          });
          that.getData()
        }
      },
    })
  },
  onLoad: function(options) {
    this.getData()
  },
})