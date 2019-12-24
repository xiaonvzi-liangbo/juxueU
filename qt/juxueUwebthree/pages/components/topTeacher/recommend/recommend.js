import requestUrl from '../../../../utils/request.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '推荐'
    },
    kinds: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    getCourse: [],
    pageNumber: 0,
    kid: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //课程详情点击事件
    curriculum(e) {
      let that = this;
      wx.navigateTo({
        url: '/pages/openClass/curriculum/curriculum?id=' + e.currentTarget.dataset.id + '&&title=' + that.data.title
      })
    },
    //获取课程信息
    getClass(kid) {
      let that = this;
      that.data.pageNumber++
        wx.request({
          url: requestUrl.courseUrl + '/api/Course/free',
          data: {
            PageSize: '10',
            PageNumber: that.data.pageNumber,
            freeType: '0',
            kind: kid
          },
          method: 'GET',
          header: {
            'content-type': 'application/json',
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            that.setData({
              getCourse: that.data.getCourse.concat(res.data),
              kid: kid

            })
          }
        })
    },

  },
  attached() {
    this.getClass(this.data.kinds)

  }
})