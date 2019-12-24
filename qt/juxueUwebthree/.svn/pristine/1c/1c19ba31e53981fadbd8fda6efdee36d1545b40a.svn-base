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
    follow: '1',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //获取关注列表
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
    //关注点击事件
    atten(e) {
      let that = this;
      let userid = wx.getStorageSync('userid');
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
    
      prevPage.setData({
        attentionId: e.currentTarget.dataset.id,
        attentionName: e.currentTarget.dataset.name
      })
      prevPage. invoke()
      wx.navigateBack({
        delta: 1
      })
    }
  },
  attached() {
    this.getFocus()
  }
})