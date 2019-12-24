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
    pageNum: 1,
    searinput: '',
    result: '',
    clean: false,
    pages: "1"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //监听输入框输入事件
    commun(e) {
      this.setData({
        searinput: e.detail.value
      })
    },
    //搜索点击事件
    community() {
      let that = this;
      wx.request({
        url: requestUrl.requestUrl + '/jxCollagePostsTalkApp/findByName',
        data: {
          name: that.data.searinput,
          pageNum: that.data.pages,
          pageSize: 10
        },
        header: {
          'content-type': 'application/json',
          "content-type": "application/x-www-form-urlencoded"
        },
        success(res) {
          if (that.data.pages == '1') {
            that.setData({
              result: res.data.rows,
              clean: true
            })
          } else {
            that.setData({
              result: that.data.result.concat(res.data.rows),
              clean: true
            })
          }
        }
      })
    },
    //取消点击事件
    quxiao() {
      this.setData({
        clean: false
      })
    },
    //获取话题列表
    getFocus() {
      let that = this;
      let userid = wx.getStorageSync('userid');
      wx.request({
        url: requestUrl.requestUrl + '/jxCollagePostsTalkApp/findByName',
        method: 'get',
        data: {
          pageNum: that.data.pageNum,
          pageSize: 10,
          userId: userid
        },
        header: {
          'content-type': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          if (that.data.pageNum=='1'){
            that.setData({
              details: res.data.rows
            })
          }else{
            that.setData({
              details: that.data.details.concat(res.data.rows)
            })
          }
          
        }
      })
    },
    //添加点击事件
    atten(e) {
      let that = this;
      let userid = wx.getStorageSync('userid');
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        topicsID: e.currentTarget.dataset.id,
        topicsName: e.currentTarget.dataset.name
      }) 
      // prevPage. invoke()
      wx.navigateBack({
        delta: 1
      })
    },
    //上拉加载
    tolower() {
      if (this.data.clean == false) { 
        if (this.data.details.length == 10) {
          this.data.pageNum++;
          this.getFocus()
        }
      } else { 
        if (this.data.result.length == 10) {
          this.data.pages++;
          this.community()
        }
      }

    }
  },
  attached() {
    this.getFocus()
  }
})