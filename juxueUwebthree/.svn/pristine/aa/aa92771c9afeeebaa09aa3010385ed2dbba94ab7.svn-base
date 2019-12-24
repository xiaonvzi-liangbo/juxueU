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
    details: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //获取粉丝列表
    getFans() {
      let that = this;
      let userid = wx.getStorageSync('userid');
      wx.request({
        url: requestUrl.requestUrl + '/jXUserApp/findByMyFans',
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
    //发帖人详情
    personage(e) {
      wx.navigateTo({
        url: '/pages/universityCircle/myPost/myPost?id=' + e.currentTarget.dataset.id,
      })
    },
    //关注点击事件
    atten(e) {
      let that = this;
      this.setData({
        private: false,
        attention: true
      });
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
            let pages = getCurrentPages();
            pages[pages.length - 2].getMy(); //异步同步
            that.getFans()
          }
         
        }
      })
    }
  },
  attached() {
    this.getFans()
  }
})