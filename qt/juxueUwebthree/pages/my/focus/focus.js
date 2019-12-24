const requestUrl = require('../../../utils/request.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    details: [],
    follow:'1',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getFocus() {
      let that = this;
      let userid = wx.getStorageSync('userid');
      wx.request({
        url: requestUrl.requestUrl + '/jXUserApp/findByMyFollow',
        method: 'get',
        data: {
          userId: userid
        },
        header: {
          'content-type': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          that.setData({
            details: res.data.data
          })
        }
      })
    },
    //页面跳转到详情
    skips(e) {
      if (e.currentTarget.dataset.type == '关注') {
        wx.navigateTo({
          url: '/pages/universityCircle/myPost/myPost?id=' + e.currentTarget.dataset.id,
        })
      } else {
        wx.navigateTo({
          url: '/pages/universityCircle/information/information?tzid=' + e.currentTarget.dataset.id,
        })
      }
    },
    //发帖人详情
    personage(e) {
      wx.navigateTo({
        url: '/pages/universityCircle/myPost/myPost?id=' + e.currentTarget.dataset.id,
      })
    },
    //关注点击事件
    atten(e) {
      let that = this;
      let userid = wx.getStorageSync('userid');
      wx.request({
        url: requestUrl.requestUrl + '/jXFollowApp/findByAuto',
        method: 'post',
        data: {
          followType: '用户',
          userId: userid,
          followId: e.currentTarget.dataset.id
        },
        header: {
          'content-type': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          if (res.data.code == '200') {
            let pages = getCurrentPages();// getCurrentPages() 函数用于获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。
            pages[pages.length - 2].getMy(); //异步同步
            that.getFocus()
          }
        }
      })
    }
  },
  attached() {
    this.getFocus()
  }
})