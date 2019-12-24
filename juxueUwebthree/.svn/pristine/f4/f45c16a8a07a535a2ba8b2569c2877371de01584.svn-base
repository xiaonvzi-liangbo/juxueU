// pages/tztopics/topics/topics.js
import requestUrl from '../../../utils/request.js'
const time = require('../../../utils/time.js')
const quantity = require('../../../utils/quantity.js')
Component({

  /**
   * 页面的初始数据
   */
  data: {
    topics: [],

  },
  methods: {
    //获取贴子详情
    gettopics() {
      let that = this
      wx.request({
        url: requestUrl.requestUrl + '/jxCollagePostsTalkApp/findByName',
        method: 'get',
        data: {
          pageNum: '1',
          pageSize: '10'
        },
        header: {
          'content-type': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          that.setData({
            topics: res.data.rows
          })
        }
      })
    },
    //页面跳转
    navigate(e){
      wx.navigateTo({
        url: "/pages/tztopics/tztopics?topid=" + e.currentTarget.dataset.topid
      })
    }
  },
  attached() {
    this.gettopics()
  }
})