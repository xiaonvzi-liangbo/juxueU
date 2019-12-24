import requestUrl from '../../../utils/request.js'
import time from '../../../utils/time.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    attention: true,
    private: false,
    id: '',
    selfUser: [],
    article: [],
    currenTable: 0,
    benren: false,
  },
  onLoad(option) {
    this.setData({
      id: option.id
    });
    let userid = wx.getStorageSync('userid');
    if (option.id == userid) {
      this.setData({
        benren: true
      })
    }
    this.selectComponent("#release").announce(option.id);
    console.log(option.id)
    this.getUser();
  },
  //点击切换页面事件
  switchPage(e) {
    this.setData({
      currenTable: e.currentTarget.dataset.table
    })
  },
  //获取用户信息
  getUser() {
    let that = this;
    let userid = wx.getStorageSync('userid');
    wx.request({
      url: requestUrl.requestUrl + '/jXUserApp/findByMy',
      method: 'get',
      data: {
        id: that.data.id,
        userId: userid
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == '200') {
          that.setData({
            selfUser: res.data.data
          })
        }
      }
    })
  },

  //私信点击事件
  private(e) {
    wx.navigateTo({
      url: '/pages/universityCircle/chat/chat?transferid=' + e.currentTarget.dataset.transferid,
    })
    this.setData({
      private: true,
      attention: false,

    })
  },
  //关注点击事件
  attention(e) {
    let that = this;
    let userid = wx.getStorageSync('userid');
    this.setData({
      private: false,
      attention: true
    });
    wx.request({
      url: requestUrl.requestUrl + '/jXFollowApp/findByAuto',
      method: 'post',
      data: {
        followType: '用户',
        followId: e.currentTarget.dataset.id,
        userId: userid
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == '200') {
          that.getUser();
          // let pages = getCurrentPages();
          // pages[pages.length - 2].getData(); //异步同步

        }
      }
    })
  },
  //详情点击事件
  particulars(e) {
    wx.navigateTo({
      url: '/pages/universityCircle/information/information?tzid=' + e.currentTarget.dataset.id,
    })
  },
})