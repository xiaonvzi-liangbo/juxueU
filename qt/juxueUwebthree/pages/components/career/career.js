import requestUrl from "../../../utils/request.js"
import time from "../../../utils/time.js"
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
    number: 1,
    getEducation: [],
    getphone: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    education() {
      let that = this;
      wx.request({
        url: requestUrl.requestUrl + '/promoteApp/list',
        data: {
          pageNum: that.data.number,
          pageSize: '10',
          proType: '2'
        },
        method: 'GET',
        header: {
          'content-type': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          for (let i = 0; i < res.data.rows.length; i++) {
            res.data.rows[i].proDate = time.cutOut(res.data.rows[i].proDate)
          }
          that.setData({
            getEducation: that.data.getEducation.concat(res.data.rows)
          })
        },
      })
    },
    //上拉加载点击事件
    tolower() {
      this.data.number++;
      this.education()
    },
    //立即预约点击事件
    appointment(e) {
      let phone = wx.getStorageSync('phone')
      wx.navigateTo({
        url: '/pages/education/appointment/appointment?proid=' + e.currentTarget.dataset.id,
      })
    },
    //getphone
    getphone() {
      let that = this
      let phone = wx.getStorageSync('phone')
      if (phone == 'undefined'){
        that.setData({
          getphone: true
        })
      } else{
        that.setData({
          getphone: false
        })
      }

    }
  },
  attached() {
    this.education(),
      this.getphone()
  }
})