// pages/components/uActivities/hotact/hotact.js
const requestUrl = require('../../../../utils/request.js')
const number = require('../../../../utils/quantity.js')
const time = require('../../../../utils/time.js')
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
    information: [],
    pageNum: 1,
    collageName: "",
    eventContent: []
  },

  /*** 组件的方法列表 */
  methods: {
    //获取热门活动
    hotevent() {
      let that = this
      wx.request({
        url: requestUrl.requestUrl + '/jxActivityMainApp/findByHotActivity',
        method: 'get',
        data: {
          pageNum: that.data.pageNum,
          pageSize: 10
        },
        header: {
          'content-type': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          if (that.data.pageNum == '1') { 
            that.setData({
              eventContent: res.data.rows
            })
          } else {  
            that.setData({
              eventContent: that.data.eventContent.concat(res.data.rows)
            })
          }
        }

      })
    },
    tower() {
      this.data.pageNum++
        this.hotevent()
    }
  },
  attached() {
    this.hotevent()
  }
})