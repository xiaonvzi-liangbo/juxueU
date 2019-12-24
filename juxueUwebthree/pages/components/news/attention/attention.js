const requestUrl = require('../../../../utils/request.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {},
  pageLifetimes: {},

  /**
   * 组件的初始数据
   */
  data: {
    news: [],
    pageNum: 1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getNews() {
      let that = this;
      let userid = wx.getStorageSync('userid');
      wx.request({
        url: requestUrl.requestUrl + '/jXInformationApp/findByType',
        method: 'get',
        data: {
          pageNum: that.data.pageNum,
          pageSize: '10',
          type: '全部',
          userId: userid
        },
        header: {
          'content-type': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          that.setData({
            news: that.data.news.concat(res.data.rows)
          })
        }
      })
    },
    getNew() {
      let that = this; 
      let userid = wx.getStorageSync('userid');
      wx.request({
        url: requestUrl.requestUrl + '/jXInformationApp/findByType',
        method: 'get',
        data: {
          pageNum: '1',
          pageSize: '10',
          type: '全部',
          userId: userid
        },
        header: {
          'content-type': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          that.setData({
            news: res.data.rows
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
            wx.showToast({
              title: '关注成功！',
              icon: 'none',
              duration: 2000
            })
            that.getNew()
          } else {
            wx.showToast({
              title: '关注失败，请重试！',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    },
    //上拉加载
    tolower() {
        this.data.pageNum++;
        this.getNews() 
    }
  },
  attached() {
    this.getNew()
  }
})